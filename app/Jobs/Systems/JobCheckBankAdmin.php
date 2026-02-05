<?php

namespace App\Jobs\Systems;
use App\Models\MySQL\BankHistoryLogsAdmin;
use App\Services\CheckBank\CheckBankService;
use App\Services\PaymentMethod\PaymentMethodService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class JobCheckBankAdmin implements ShouldQueue
{
    use Queueable;

    protected $bankId;
    protected $formatTime = 'd/m/Y H:i:s'; // d/m/Y or d-m-Y
    protected $checkBankService;

    /**
     * Create a new job instance.
     */
    public function __construct($bankId)
    {
        $this->bankId = $bankId;
        $this->queue = 'check-bank-admin';
    }

    /**
     * Execute the job.
     */
    public function handle(PaymentMethodService $paymentMethodService, CheckBankService $checkBankService): void
    {
        $this->checkBankService = $checkBankService;

        $bank = $paymentMethodService->findById($this->bankId);
        if (empty($bank)) {
            echo "Ngân hàng không hợp lệ";
            return;
        }
        if (empty($bank->details)) {
            echo "Không có thông tin ngân hàng";
            return;
        }
        $infoBank = $bank->details;
        $userName = $infoBank['user_name'] ?? "";
        $password = $infoBank['password'] ?? "";
        $accountNumber = $infoBank['account_number'] ?? "";
        $bankCode = $bank?->key ?? "";
        if (empty($userName) || empty($password) || empty($accountNumber) || empty($bankCode)) {
            echo "Thông tin ngân hàng không hợp lệ";
            return;
        }

        $history = $checkBankService->getHistoryBankInfo($bank);
        if ($history['success'] == false) {
            echo $history['message'];
            return;
        }

        if (count($history['data']) > 0) {
            foreach ($history['data'] as $transaction) {
                $dataLog = $this->checkBankService->bankClassification($bankCode, $transaction);
                if (empty($dataLog)) {
                    echo "Giao dịch không hợp lệ" . PHP_EOL;
                    continue;
                }

                //check giao dịch này đã tồn tại hay chưa
                $checkExist = BankHistoryLogsAdmin::where('key_unique', $dataLog['key_unique'])->doesntExist();

                if ($checkExist) {
                    //Lưu lại giao dịch này
                    $bankHistoryLog = BankHistoryLogsAdmin::create($dataLog);

                    //Valid transaction 
                    $validate = $this->checkBankService->validateTransaction($dataLog);
                    if ($validate['success'] == false) {
                        echo "Giao dịch không hợp lệ" . PHP_EOL;
                        $bankHistoryLog->update(['error_info' => $validate['message']]);
                        continue;
                    }

                    $contentBank = $dataLog['content_bank'];
                    $transactionId = $dataLog['key_unique'];
                    $amount = $dataLog['amount'];
                    dispatch(JobProcessPaymentPlan::forBankTransaction(contentBank: $contentBank, transactionId: $transactionId, amount: $amount));
                }
            }
        }
    }
}
