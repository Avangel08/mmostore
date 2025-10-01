<?php

namespace App\Http\Controllers\Seller\PaymentHistory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\PaymentHistory\PaymentHistoryRequest;
use App\Models\MySQL\PaymentMethods;
use App\Services\BalanceHistory\BalanceHistoryService;
use App\Services\CheckBank\VietCombank;
use App\Services\PaymentMethod\PaymentMethodService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class PaymentHistoryController extends Controller
{
    private $balanceHistoryService;
    private $paymentMethodService;

    public function __construct(BalanceHistoryService $balanceHistoryService, PaymentMethodService $paymentMethodService)
    {
        $this->balanceHistoryService = $balanceHistoryService;
        $this->paymentMethodService = $paymentMethodService;
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
        $listBank = PaymentMethods::LIST_BANK;

        return Inertia::render('PaymentHistory/index', [
            'paymentHistories' => fn() => $this->balanceHistoryService->getForTable($request),
            'listBank' => $listBank,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PaymentHistoryRequest $request)
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
            $result = $this->paymentMethodService->updateOrCreate([
                "user_id" => auth(config('guard.seller'))->user()->id,
                "user_type" => PaymentMethods::USER_TYPE['SELLER'],
                "type" => PaymentMethods::TYPE['BANK'],
                "key" => $data['key'],
                "name" => PaymentMethods::LIST_BANK[$data['key']],
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
            if ($result) {
                return back()->with('success', 'Update successfully');
            }
        }
        return back()->with('error', 'Verified failed');
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
    public function edit()
    {
        $paymentMethod = $this->paymentMethodService->findByUserId(auth(config('guard.seller'))->user()->id);
        return response()->json([
            'paymentMethod' => $paymentMethod
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function verifyPayment(PaymentHistoryRequest $request)
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
}
