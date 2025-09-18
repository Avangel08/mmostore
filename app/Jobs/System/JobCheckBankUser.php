<?php

namespace App\Jobs\System;

use App\Jobs\Systems\jobDepositCustomer;
use App\Models\Mongo\BankHistoryLogs;
use App\Services\CheckBank\CheckBankService;
use App\Services\PaymentMethod\PaymentMethodService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class JobCheckBankUser implements ShouldQueue
{
    use Queueable;

    protected $bankId;
    protected $formatTime = 'd/m/Y H:i:s'; // d/m/Y or d-m-Y

    /**
     * Create a new job instance.
     */
    public function __construct($bankId)
    {
        $this->bankId = $bankId;
    }

    /**
     * Execute the job.
     */
    public function handle(PaymentMethodService $paymentMethodService, CheckBankService $checkBankService): void
    {
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
        $accountName = $infoBank['account_name'];
        $password = $infoBank['password'];
        $accountNumber = $infoBank['account_number'];
        $bankCode = $bank->key;
        if (empty($accountName) || empty($password) || empty($accountNumber) || empty($bankCode)) {
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
                $dataLog = $checkBankService->bankClassification($bankCode, (array) $transaction);
                if (empty($dataLog)) {
                    echo "Giao dịch không hợp lệ" . PHP_EOL;
                    continue;
                }
                //check giao dịch này đã tồn tại hay chưa
                $checkExist = BankHistoryLogs::where('key_unique', $dataLog['key_unique'])->doesntExist();
                if ($checkExist) {
                    //Lưu lại giao dịch này
                    BankHistoryLogs::insert($dataLog);

                    //Valid transaction 
                    $validate = $checkBankService->validateTransaction($dataLog);
                    if ($validate['success'] == false) {
                        echo "Giao dịch không hợp lệ" . PHP_EOL;
                        BankHistoryLogs::where('key_unique', $dataLog['key_unique'])->update(['error_info' => $validate['message']]);
                        continue;
                    }

                    $amount = $dataLog['amount'];
                    $userId = $dataLog['user_id'];
                    $customerIdentifier = $dataLog['customer_identifier'];
                    $transactionId = $dataLog['key_unique'];

                    jobDepositCustomer::dispatchSync($userId, $customerIdentifier, $amount, $transactionId, $bank->id);
                }
            }
        }
    }
}
