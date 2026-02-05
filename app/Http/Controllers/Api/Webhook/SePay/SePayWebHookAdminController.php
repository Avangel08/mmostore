<?php

namespace App\Http\Controllers\Api\Webhook\SePay;

use App\Http\Controllers\Controller;
use App\Jobs\Systems\JobProcessPaymentPlan;
use App\Models\MySQL\WebhookLogBanksAdmin;
use App\Services\Deposits\DepositService;
use App\Services\PaymentMethod\PaymentMethodService;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;
use App\Services\SePay\SePayService;
use App\Services\Banks\BankService;
use App\Services\CheckBank\CheckBankService;

class SePayWebHookAdminController extends Controller
{
    private $sePayService;
    private $bankService;
    private $paymentMethodService;
    private $depositService;
    private $checkBankService;
    public function __construct(
        SePayService $sePayService,
        BankService $bankService,
        PaymentMethodService $paymentMethodService,
        DepositService $depositService,
        CheckBankService $checkBankService
    ) {
        $this->sePayService = $sePayService;
        $this->bankService = $bankService;
        $this->paymentMethodService = $paymentMethodService;
        $this->depositService = $depositService;
        $this->checkBankService = $checkBankService;
    }
    public function callBack(Request $request)
    {
        try {
            $data = $request->all();
            $token = $this->sePayService->bearerToken($request);
            $shortName = $data['gateway'];
            $bank = $this->bankService->findByShortName($shortName);
            if (!$bank) {
                throw ValidationException::withMessages(['message' => ['Bank not found']]);
            }
            $paymentMethod = $this->paymentMethodService->findByKey($bank['code']);
            if (!$paymentMethod) {
                throw ValidationException::withMessages(['message' => ['Payment method not found']]);
            }

            throw_if(
                !empty($token) && $token !== $paymentMethod['details']['api_key'],
                ValidationException::withMessages(['message' => ['Token is invalid']])
            );

            throw_if(
                WebhookLogBanksAdmin::where('transaction', $data['referenceCode'])->exists(),
                ValidationException::withMessages(['message' => ['Transaction already exists']])
            );

            WebhookLogBanksAdmin::create([
                'platform' => WebhookLogBanksAdmin::PLATFORM['SEPAY'],
                'transaction' => $data['referenceCode'],
                'gateway' => $shortName,
                'data' => $data,
                'date_at' => Carbon::createFromFormat('Y-m-d H:i:s', $data['transactionDate'])->toDateTimeString(),
            ]);

            $contentBank = $this->checkBankService->parseDescription($data['description'], $bank['code']);
            if (empty($contentBank)) {
                throw ValidationException::withMessages(['message' => ['Content bank is invalid']]);
            }

            $contentBank = $contentBank['content_bank'];
            $transactionId = $data['referenceCode'];
            $amount = $data['transferAmount'];
            dispatch(JobProcessPaymentPlan::forBankTransaction(contentBank: $contentBank, transactionId: $transactionId, amount: $amount));
            return response()->json([
                'status' => 'success',
                'message' => 'Webhook received successfully',
                'data' => $data
            ]);

        } catch (\Throwable $th) {
            \Log::error('SePayWebHookAdminController Error: ' . $th);
            throw ValidationException::withMessages(['message' => [$th->getMessage()]]);
        }
    }
}
