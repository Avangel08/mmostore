<?php

namespace App\Http\Controllers\Admin\PaymentMethod;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PaymentMethod\PaymentMethodAdminRequest;
use App\Models\MySQL\PaymentMethods;
use App\Services\Banks\BankService;
use App\Services\CheckBank\VietCombank;
use App\Services\PaymentMethod\PaymentMethodService;
use App\Services\SePay\SePayService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentMethodAdminController extends Controller
{
    protected $paymentMethodService;
    protected $bankService;

    public function __construct(PaymentMethodService $paymentMethodService, BankService $bankService)
    {
        $this->paymentMethodService = $paymentMethodService;
        $this->bankService = $bankService;
    }
    public function index(Request $request)
    {
        // if (auth(config('guard.admin'))->user()->cannot('payment-history_view')) {
        //     return abort(403);
        // }

        $request = $request->all();
        $listBank = PaymentMethods::LIST_BANK;
        $listType = array_flip(PaymentMethods::TYPE);
        $listStatus = array_flip(PaymentMethods::STATUS);
        return Inertia::render('PaymentMethod/index', [
            'paymentMethods' => fn() => $this->paymentMethodService->getForTable($request),
            'listBank' => $listBank,
            'listType' => $listType,
            'listStatus' => $listStatus,
        ]);
    }
    public function create(Request $request)
    {
        $host = $request->root();
        $listTypeOptions = array_flip(array_intersect_key(PaymentMethods::TYPE, array_flip(['BANK', 'SEPAY'])));
        $listBank = PaymentMethods::LIST_BANK;
        $listBankSePay = $this->bankService->getListForSePay();
        $linkWebhook = $this->paymentMethodService->renderLinkWebhook($host);
        return response()->json([
            'listTypeOptions' => $listTypeOptions,
            'listBankSePay' => $listBankSePay,
            'listBank' => $listBank,
            'linkWebhook' => $linkWebhook
        ]);
    }
    public function store(PaymentMethodAdminRequest $request)
    {
        try {
            $data = $request->validated();
            switch ($data['type']) {
                case PaymentMethods::TYPE['BANK']:
                    return $this->saveBank($data);
                case PaymentMethods::TYPE['SEPAY']:
                    return $this->saveSePay($data);
            }
        } catch (\Throwable $th) {
            return back()->with('error', $th->getMessage());
        }
    }
    public function edit($id, Request $request)
    {
        $paymentMethod = $this->paymentMethodService->findById($id);
        $host = $request->root();
        $listTypeOptions = array_flip(array_intersect_key(PaymentMethods::TYPE, array_flip(['BANK', 'SEPAY'])));
        $listBank = PaymentMethods::LIST_BANK;
        $listBankSePay = $this->bankService->getListForSePay();
        $linkWebhook = $this->paymentMethodService->renderLinkWebhook($host);

        return response()->json([
            'listTypeOptions' => $listTypeOptions,
            'listBankSePay' => $listBankSePay,
            'listBank' => $listBank,
            'linkWebhook' => $linkWebhook,
            'paymentMethod' => $paymentMethod
        ]);
    }
    public function update(PaymentMethodAdminRequest $request, string $id)
    {
        try {
            $data = $request->validated();
            switch ($data['type']) {
                case PaymentMethods::TYPE['BANK']:
                    return $this->saveBank($data, $id);
                case PaymentMethods::TYPE['SEPAY']:
                    return $this->saveSePay($data, $id);
            }
        } catch (\Throwable $th) {
            return back()->with('error', $th->getMessage());
        }
    }
    public function destroy(string $id)
    {
        $paymentMethod = $this->paymentMethodService->findById($id);
        if (!$paymentMethod) {
            return back()->with('error', 'Payment method not found');
        }
        $this->paymentMethodService->delete($id);
        return back()->with('success', 'Payment method deleted successfully');
    }
    public function verifyPayment(PaymentMethodAdminRequest $request)
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
    public function verifySePay(PaymentMethodAdminRequest $request)
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
            $paymentMethod = $this->paymentMethodService->findById($id);
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
                $result = $this->paymentMethodService->update($paymentMethod, [
                    "type" => PaymentMethods::TYPE['BANK'],
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
                    "status" => PaymentMethods::STATUS['ACTIVE'],
                    "icon" => null,
                    "is_verify_otp" => true,
                ]);
            } else {
                $result = $this->paymentMethodService->create([
                    "type" => PaymentMethods::TYPE['BANK'],
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
                    "status" => PaymentMethods::STATUS['ACTIVE'],
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
            $paymentMethod = $this->paymentMethodService->findById($id);
            if (!$paymentMethod) {
                return back()->with('error', 'Payment method not found');
            }
        }
        $bank = $this->bankService->findByCode($data['key']);
        if (!$bank) {
            return back()->with('error', 'Bank not found');
        }

        if ($id && isset($paymentMethod) && $paymentMethod) {
            $result = $this->paymentMethodService->update($paymentMethod, [
                "type" => PaymentMethods::TYPE['SEPAY'],
                "key" => $bank['code'],
                "name" => $bank['short_name'],
                "title" => $bank['name'],
                "description" => null,
                "details" => [
                    "account_name" => trim($data['account_name']),
                    "account_number" => trim($data['account_number']),
                    "api_key" => trim($data['api_key']),
                ],
                "status" => PaymentMethods::STATUS['ACTIVE'],
                "icon" => null,
                "is_verify_otp" => false,
            ]);
        } else {
            $result = $this->paymentMethodService->create([
                "type" => PaymentMethods::TYPE['SEPAY'],
                "key" => $bank['code'],
                "name" => $bank['short_name'],
                "title" => $bank['name'],
                "description" => null,
                "details" => [
                    "account_name" => trim($data['account_name']),
                    "account_number" => trim($data['account_number']),
                    "api_key" => trim($data['api_key']),
                ],
                "status" => PaymentMethods::STATUS['ACTIVE'],
                "icon" => null,
                "is_verify_otp" => false,
            ]);
        }
        if ($result) {
            return back()->with('success', 'Update successfully');
        }
        return back()->with('error', 'Update failed');
    }
    public function getListPaymentMethod(Request $request)
    {
        try {
            $searchTerm = $request->input('search', '');
            $page = (int) $request->input('page', 1);

            $options = $this->paymentMethodService->getListPaymentMethod($searchTerm, $page, 10);

            return response()->json([
                'results' => $options['results'] ?? [],
                'has_more' => $options['has_more'] ?? false,
            ]);
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.admin'))->id() ?? null]);

            return response()->json([
                'results' => [],
                'has_more' => false,
            ], 500);
        }
    }
}
