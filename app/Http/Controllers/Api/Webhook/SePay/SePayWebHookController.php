<?php

namespace App\Http\Controllers\Api\Webhook\SePay;

use App\Http\Controllers\Controller;
use App\Jobs\Systems\JobDepositCustomer;
use App\Models\Mongo\WebhookLogBanks;
use App\Services\Deposits\DepositService;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;
use App\Services\SePay\SePayService;
use App\Services\Banks\BankService;
use App\Services\PaymentMethodSeller\PaymentMethodSellerService;
use App\Services\CheckBank\CheckBankService;

class SePayWebHookController extends Controller
{
    private $sePayService;
    private $bankService;
    private $paymentMethodSellerService;
    private $depositService;
    private $checkBankService;
    public function __construct(
        SePayService $sePayService,
        BankService $bankService,
        PaymentMethodSellerService $paymentMethodSellerService,
        DepositService $depositService,
        CheckBankService $checkBankService
    ) {
        $this->sePayService = $sePayService;
        $this->bankService = $bankService;
        $this->paymentMethodSellerService = $paymentMethodSellerService;
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
            $paymentMethod = $this->paymentMethodSellerService->findByKey($bank['code']);
            if (!$paymentMethod) {
                throw ValidationException::withMessages(['message' => ['Payment method not found']]);
            }

            throw_if(
                !empty($token) && $token !== $paymentMethod['details']['api_key'],
                ValidationException::withMessages(['message' => ['Token is invalid']])
            );
            
            throw_if(
                WebhookLogBanks::query()->where('transaction', $data['referenceCode'])->exists(),
                ValidationException::withMessages(['message' => ['Transaction already exists']])
            );

            WebhookLogBanks::create([
                'platform' => WebhookLogBanks::PLATFORM['SEPAY'],
                'transaction' => $data['referenceCode'],
                'gateway' => $shortName,
                'data' => $data,
                'date_at' => Carbon::createFromFormat('Y-m-d H:i:s', $data['transactionDate'])->toDateTimeString(),
            ]);

            $contentBank = $this->checkBankService->parseDescription($data['description'], $bank['code']);
            if (empty($contentBank)) {
                throw ValidationException::withMessages(['message' => ['Content bank is invalid']]);
            }

            JobDepositCustomer::dispatch($contentBank['user_id'], $contentBank['content_bank'], $data['transferAmount'], $data['referenceCode'], $paymentMethod['_id']);
            return response()->json([
                'status' => 'success',
                'message' => 'Webhook received successfully',
                'data' => $data
            ]);

        } catch (\Throwable $th) {
            \Log::error('SePayWebHookController Error: ' . $th);
            throw ValidationException::withMessages(['message' => [$th->getMessage()]]);
        }
    }
}
