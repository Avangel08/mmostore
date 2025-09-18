<?php

namespace App\Jobs\Systems;

use App\Models\Mongo\BalanceHistories;
use App\Services\BalanceHistory\BalanceHistoryService;
use App\Services\Customer\CustomerService;
use App\Services\CurrencyRate\CurrencyRateService;
use App\Services\Home\StoreService;
use App\Services\Home\UserService;
use App\Services\Tenancy\TenancyService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class jobDepositCustomer implements ShouldQueue
{
    use Queueable;

    protected $userId;
    protected $customerIdentifier;
    protected $amount;
    protected $transactionId;
    protected $paymentMethodId;
    /**
     * Create a new job instance.
     */
    public function __construct($userId, $customerIdentifier, $amount, $transactionId, $paymentMethodId)
    {
        $this->userId = $userId;
        $this->customerIdentifier = $customerIdentifier;
        $this->amount = $amount;
        $this->transactionId = $transactionId;
        $this->paymentMethodId = $paymentMethodId;
    }

    /**
     * Execute the job.
     */
    public function handle(
        UserService $userService,
        CustomerService $customerService,
        StoreService $storeService,
        BalanceHistoryService $balanceHistoryService,
        CurrencyRateService $currencyRateService,
        TenancyService $tenancyService
    ): void {
        echo "==========================================Start jobDepositCustomer==========================================".PHP_EOL;
        $store = $storeService->findByUserId($this->userId);
        if (empty($store)) {
            echo "Store not found or user not have store".PHP_EOL;
            echo "user_id: " . $this->userId.PHP_EOL;
            return;
        }
        try {
            $connection = $tenancyService->buildConnectionFromStore($store);
            $tenancyService->applyConnection($connection, true);
        } catch (\Throwable $th) {
            echo 'Lỗi jobDepositCustomer set store database config: ' . $th->getMessage().PHP_EOL;
            throw $th;
        }

        try {
            $customer = $customerService->findByIdentifier($this->customerIdentifier);
            if (empty($customer)) {
                echo "Customer not found".PHP_EOL;
                echo "customer_identifier: " . $this->customerIdentifier.PHP_EOL;
                return;
            }
            $before = $customer->balance;
            $after = $customer->balance + $this->amount;
            $customerUpdated = $customerService->update($customer, ['balance' => $customer->balance + $this->amount]);

            if ($customerUpdated) {
                $balanceHistoryService->create([
                    'customer_id' => $customer->_id,
                    'payment_method_id' => $this->paymentMethodId,
                    'type' => BalanceHistories::TYPE['deposit'],
                    'amount' => $currencyRateService->convertVNDToUSD($this->amount),
                    'amount_vnd' => $this->amount,
                    'before' => $before,
                    'after' => $after,
                    'transaction' => $this->transactionId,
                    'description' => 'Nạp tiền từ bank',
                    'date_at' => Carbon::now()->toDateTimeString(),
                ]);
            }
        } catch (\Throwable $th) {
            echo 'Lỗi jobDepositCustomer update customer: ' . $th->getMessage().PHP_EOL;
            throw $th;
        }
        echo "==========================================End jobDepositCustomer==========================================".PHP_EOL;
    }
}
