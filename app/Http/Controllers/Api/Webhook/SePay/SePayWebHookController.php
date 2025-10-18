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
                throw ValidationException::withMessages(['message' => ['Ngân hàng không tồn tại']]);
            }
            $paymentMethod = $this->paymentMethodSellerService->findByKey($bank['code']);
            if (!$paymentMethod) {
                throw ValidationException::withMessages(['message' => ['Phương thức thanh toán không tồn tại']]);
            }

            throw_if(
                !empty($token) && $token !== $paymentMethod['details']['api_key'],
                ValidationException::withMessages(['message' => ['Token không hợp lệ']])
            );
            
            throw_if(
                WebhookLogBanks::query()->where('transaction', $data['referenceCode'])->exists(),
                ValidationException::withMessages(['message' => ['Transaction này đã thực hiện']])
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
                throw ValidationException::withMessages(['message' => ['Nội dung chuyển khoản không hợp lệ']]);
            }

            JobDepositCustomer::dispatch($contentBank['user_id'], $contentBank['content_bank'], $data['transferAmount'], $data['referenceCode'], $paymentMethod['_id']);
            return response()->json([
                'status' => 'success',
                'message' => 'Webhook nhận thành công',
                'data' => $data
            ]);

        } catch (\Throwable $th) {
            \Log::error('SePayWebHookController Error: ' . $th);
            throw ValidationException::withMessages(['message' => [$th->getMessage()]]);
        }
    }
}
