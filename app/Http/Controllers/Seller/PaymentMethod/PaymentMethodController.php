<?php

namespace App\Http\Controllers\Seller\PaymentMethod;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\PaymentHistory\PaymentHistoryRequest;
use App\Http\Requests\Seller\PaymentMethod\PaymentMethodRequest;
use App\Models\Mongo\PaymentMethodSeller;
use App\Models\MySQL\PaymentMethods;
use App\Services\BalanceHistory\BalanceHistoryService;
use App\Services\Banks\BankService;
use App\Services\CheckBank\VietCombank;
use App\Services\PaymentMethod\PaymentMethodService;
use App\Services\PaymentMethodSeller\PaymentMethodSellerService;
use App\Services\SePay\SePayService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class PaymentMethodController extends Controller
{
    private $paymentMethodSellerService;
    private $bankService;

    public function __construct(PaymentMethodSellerService $paymentMethodSellerService, BankService $bankService)
    {
        $this->paymentMethodSellerService = $paymentMethodSellerService;
        $this->bankService = $bankService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // if (auth(config('guard.seller'))->user()->cannot('payment-history_view')) {
        //     return abort(403);
        // }

        $request = $request->all();
        $listBank = PaymentMethodSeller::LIST_BANK;
        $listType = array_flip(PaymentMethodSeller::TYPE);
        $listStatus = array_flip(PaymentMethodSeller::STATUS);
        return Inertia::render('PaymentMethod/index', [
            'paymentMethods' => fn() => $this->paymentMethodSellerService->getForTable($request),
            'listBank' => $listBank,
            'listType' => $listType,
            'listStatus' => $listStatus,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $host = $request->root();
        $listTypeOptions = array_flip(array_intersect_key(PaymentMethodSeller::TYPE, array_flip(['BANK', 'SEPAY'])));
        $listBank = PaymentMethodSeller::LIST_BANK;
        $listBankSePay = $this->bankService->getListForSePay();
        $linkWebhook = $this->paymentMethodSellerService->renderLinkWebhook($host);
        return response()->json([
            'listTypeOptions' => $listTypeOptions,
            'listBankSePay' => $listBankSePay,
            'listBank' => $listBank,
            'linkWebhook' => $linkWebhook
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PaymentMethodRequest $request)
    {
        try {
            $data = $request->validated();
            switch ($data['type']) {
                case PaymentMethodSeller::TYPE['BANK']:
                    return $this->saveBank($data);
                case PaymentMethodSeller::TYPE['SEPAY']:
                    return $this->saveSePay($data);
            }
        } catch (\Throwable $th) {
            return back()->with('error', $th->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id, Request $request)
    {
        $paymentMethod = $this->paymentMethodSellerService->findById($id);
        $host = $request->root();
        $listTypeOptions = array_flip(array_intersect_key(PaymentMethodSeller::TYPE, array_flip(['BANK', 'SEPAY'])));
        $listBank = PaymentMethodSeller::LIST_BANK;
        $listBankSePay = $this->bankService->getListForSePay();
        $linkWebhook = $this->paymentMethodSellerService->renderLinkWebhook($host);

        return response()->json([
            'listTypeOptions' => $listTypeOptions,
            'listBankSePay' => $listBankSePay,
            'listBank' => $listBank,
            'linkWebhook' => $linkWebhook,
            'paymentMethod' => $paymentMethod
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PaymentMethodRequest $request, string $id)
    {
        try {
            $data = $request->validated();
            switch ($data['type']) {
                case PaymentMethodSeller::TYPE['BANK']:
                    return $this->saveBank($data, $id);
                case PaymentMethodSeller::TYPE['SEPAY']:
                    return $this->saveSePay($data, $id);
            }
        } catch (\Throwable $th) {
            return back()->with('error', $th->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $paymentMethod = $this->paymentMethodSellerService->findById($id);
        if (!$paymentMethod) {
            return back()->with('error', 'Payment method not found');
        }
        $this->paymentMethodSellerService->delete($id);
        return back()->with('success', 'Payment method deleted successfully');
    }

    public function verifyPayment(PaymentMethodRequest $request)
    {
        $data = $request->validated();
        $vietcombankService = new VietCombank(trim($data['user_name']), trim($data['password']), trim($data['account_number']));

        //Send OTP
        if (isset($data['otp']) && !empty($data['otp'])) {
            $otpResult = $vietcombankService->submitOtpLogin($data['otp']);
            \Log::info(json_encode($otpResult));
            if (isset($otpResult) && $otpResult['success']) {
                return back()->with('success', 'Verified successfully');
            } else {
                return back()->with('error', 'Verified failed. OTP invalid');
            }
        }
        $loginResult = $vietcombankService->doLogin();
        if (isset($loginResult) && !$loginResult['success']) {
            return back()->with('error', $loginResult['message']);
        }

        $fromDate = Carbon::now()->subDays(7)->format('d/m/Y');
        $toDate = Carbon::now()->format('d/m/Y');
        $history = $vietcombankService->getHistories($fromDate, $toDate, $data['account_number']);
        if (isset($history) && $history->code != '00' && $history->code != '108') {
            return back()->with('error', 'Verified failed');
        }

        if (isset($history) && $history->code == '108') {
            return back()->with('info', 'Verified successfully. Please enter OTP');
        }

        if (isset($history) && $history->code == '00') {
            return back()->with('success', 'Verified successfully');
        }

        return back()->with('error', 'Verified failed');
    }

    public function verifySePay(PaymentMethodRequest $request)
    {
        $data = $request->validated();
        $sepayService = new SePayService();
        $result = $sepayService->getListTransaction($data['api_key']);
        if ($result) {
            return back()->with('success', 'Verified successfully');
        }
        return back()->with('error', 'Verified failed');
    }

    public function saveBank($data, $id = null)
    {
        $vietcombankService = new VietCombank(trim($data['user_name']), trim($data['password']), trim($data['account_number']));
        if ($id) {
            $paymentMethod = $this->paymentMethodSellerService->findById($id);
            if (!$paymentMethod) {
                return back()->with('error', 'Payment method not found');
            }
        }

        //Send OTP
        if (isset($data['otp']) && !empty($data['otp'])) {
            $otpResult = $vietcombankService->submitOtpLogin($data['otp']);
            \Log::info(json_encode($otpResult));
            if (isset($otpResult) && $otpResult['success']) {
                return back()->with('success', 'Verified successfully');
            } else {
                return back()->with('error', 'Verified failed. OTP invalid');
            }
        }
        $loginResult = $vietcombankService->doLogin();
        if (isset($loginResult) && !$loginResult['success']) {
            return back()->with('error', 'Verified failed');
        }

        $fromDate = Carbon::now()->subDays(7)->format('d/m/Y');
        $toDate = Carbon::now()->format('d/m/Y');
        $history = $vietcombankService->getHistories($fromDate, $toDate, $data['account_number']);
        if (isset($history) && $history->code != '00' && $history->code != '108') {
            return back()->with('error', 'Verified failed');
        }

        if (isset($history) && $history->code == '108') {
            return back()->with('info', 'Verified successfully. Please enter OTP');
        }

        if (isset($history) && $history->code == '00') {

            $bank = $this->bankService->findByCode($data['key']);
            if (!$bank) {
                return back()->with('error', 'Bank not found');
            }

            if ($id && isset($paymentMethod) && $paymentMethod) {
                $result = $this->paymentMethodSellerService->update($paymentMethod, [
                    "type" => PaymentMethodSeller::TYPE['BANK'],
                    "key" => $bank['code'],
                    "name" => $bank['short_name'],
                    "title" => $bank['name'],
                    "description" => null,
                    "details" => [
                        "account_name" => trim($data['account_name']),
                        "account_number" => trim($data['account_number']),
                        "user_name" => trim($data['user_name']),
                        "password" => trim($data['password']),
                    ],
                    "status" => PaymentMethodSeller::STATUS['ACTIVE'],
                    "icon" => null,
                    "is_verify_otp" => true,
                ]);
            } else {
                $result = $this->paymentMethodSellerService->create([
                    "type" => PaymentMethodSeller::TYPE['BANK'],
                    "key" => $bank['code'],
                    "name" => $bank['short_name'],
                    "title" => $bank['name'],
                    "description" => null,
                    "details" => [
                        "account_name" => trim($data['account_name']),
                        "account_number" => trim($data['account_number']),
                        "user_name" => trim($data['user_name']),
                        "password" => trim($data['password']),
                    ],
                    "status" => PaymentMethodSeller::STATUS['ACTIVE'],
                    "icon" => null,
                    "is_verify_otp" => true,
                ]);
            }
            if ($result) {
                return back()->with('success', 'Update successfully');
            }
        }
        return back()->with('error', 'Update failed');
    }

    public function saveSePay($data, $id = null)
    {

        if ($id) {
            $paymentMethod = $this->paymentMethodSellerService->findById($id);
            if (!$paymentMethod) {
                return back()->with('error', 'Payment method not found');
            }
        }
        $bank = $this->bankService->findByCode($data['key']);
        if (!$bank) {
            return back()->with('error', 'Bank not found');
        }

        if ($id && isset($paymentMethod) && $paymentMethod) {
            $result = $this->paymentMethodSellerService->update($paymentMethod, [
                "type" => PaymentMethodSeller::TYPE['SEPAY'],
                "key" => $bank['code'],
                "name" => $bank['short_name'],
                "title" => $bank['name'],
                "description" => null,
                "details" => [
                    "account_name" => trim($data['account_name']),
                    "account_number" => trim($data['account_number']),
                    "api_key" => trim($data['api_key']),
                ],
                "status" => PaymentMethodSeller::STATUS['ACTIVE'],
                "icon" => null,
                "is_verify_otp" => false,
            ]);
        } else {
            $result = $this->paymentMethodSellerService->create([
                "type" => PaymentMethodSeller::TYPE['SEPAY'],
                "key" => $bank['code'],
                "name" => $bank['short_name'],
                "title" => $bank['name'],
                "description" => null,
                "details" => [
                    "account_name" => trim($data['account_name']),
                    "account_number" => trim($data['account_number']),
                    "api_key" => trim($data['api_key']),
                ],
                "status" => PaymentMethodSeller::STATUS['ACTIVE'],
                "icon" => null,
                "is_verify_otp" => false,
            ]);
        }
        if ($result) {
            return back()->with('success', 'Update successfully');
        }
        return back()->with('error', 'Update failed');
    }
}
