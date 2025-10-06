<?php

namespace App\Jobs\Systems;

use App\Models\Mongo\Customers;
use App\Models\Mongo\SubProducts;
use App\Models\Mongo\Accounts;
use App\Models\Mongo\BalanceHistories;
use App\Services\Customer\CustomerService;
use App\Services\Product\SubProductService;
use App\Services\BalanceHistory\BalanceHistoryService;
use App\Services\Tenancy\TenancyService;
use App\Services\Home\StoreService;
use Illuminate\Queue\Middleware\WithoutOverlapping;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Exception;
use MongoDB\BSON\ObjectId;

class JobProcessPurchase implements ShouldQueue
{
    use Queueable;

    protected $productId;
    protected $subProductId;
    protected $customerId;
    protected $quantity;
    protected $userId;
    protected $orderId;

    public $uniqueFor = 300; // 5 phút unique
    public $timeout = 120; // 2 phút timeout

    public function __construct(
        $productId,
        $subProductId,
        $customerId,
        $quantity,
        $userId,
        $orderId = null,
    ) {
        $this->productId = $productId;
        $this->subProductId = $subProductId;
        $this->customerId = $customerId;
        $this->quantity = $quantity;
        $this->userId = $userId;
        $this->orderId = $orderId;
        $this->queue = 'process-purchase';
    }

    public function middleware(): array
    {
        $key = 'purchase_' . $this->productId . '_' . $this->subProductId;

        return [
            (new WithoutOverlapping($key))
                ->expireAfter($this->uniqueFor ?? 300),
        ];
    }

    public function backoff(): array|int
    {
        return [2, 5, 10];
    }

    /**
     * Execute the job.
     */
    public function handle(
        SubProductService $subProductService,
        CustomerService $customerService,
        BalanceHistoryService $balanceHistoryService,
        StoreService $storeService,
        TenancyService $tenancyService
    ): void {
        try {
            $store = $storeService->findByUserId($this->userId);
            if (empty($store)) {
                echo "Store not found or user not have store" . PHP_EOL;
                echo "user_id: " . $this->userId . PHP_EOL;
                return;
            }

            $connection = $tenancyService->buildConnectionFromStore($store);
            $tenancyService->applyConnection($connection, true);
            
            $this->cleanupStaleReservations($this->subProductId);
            
            $validationResult = $this->validatePurchaseData($subProductService, $customerService);

            if (!$validationResult['valid']) {
                echo "Validation failed: " . $validationResult['message'] . PHP_EOL;
                return;
            }

            $subProduct = $validationResult['sub_product'];
            $customer = $validationResult['customer'];

            // WithoutOverlapping middleware đảm nhiệm khóa theo product+sub_product

            $availableQuantity = $this->getAvailableQuantity($subProduct);

            if ($availableQuantity < $this->quantity) {
                return;
            }

            if ($subProduct->quantity < $this->quantity) {
                return;
            }

            $totalPrice = $subProduct->price * $this->quantity;

            // Khấu trừ số dư bằng atomic operation: chỉ trừ nếu đủ tiền
            $deducted = $this->deductCustomerBalanceAtomic($this->customerId, $totalPrice);
            if (!$deducted) {
                return;
            }

            // Ghi lịch sử số dư (không critical, nếu lỗi sẽ hoàn tiền và fail)
            try {
                $balanceHistoryService->create([
                    'customer_id' => $this->customerId,
                    'type' => BalanceHistories::TYPE['purchase'],
                    'amount' => -$totalPrice,
                    'before' => null,
                    'after' => null,
                    'description' => "Purchase : {$subProduct->name}, Quantity: {$this->quantity}",
                    'date_at' => now(),
                    'transaction' => $this->orderId ?? 'PURCHASE_' . time()
                ]);
            } catch (\Exception $e) {
                // Hoàn tiền nếu ghi lịch sử thất bại
                $this->refundCustomerBalance($this->customerId, $totalPrice);
                return;
            }

            // Reserve accounts (atomic từng bản ghi)
            $accountsToSell = $this->getAccountsToSell($subProduct, $this->quantity);
            if (count($accountsToSell) < $this->quantity) {
                // Rollback các account đã reserve và hoàn tiền
                $this->rollbackReservedAccounts($accountsToSell);
                $this->refundCustomerBalance($this->customerId, $totalPrice);
                return;
            }

            // Gán order_id cuối cùng nếu có
            if ($this->orderId) {
                foreach ($accountsToSell as $account) {
                    $account->update([
                        'order_id' => $this->orderId
                    ]);
                }
            }

            // Cập nhật stock SubProduct (atomic). Nếu thất bại: rollback & hoàn tiền
            $stockUpdated = $this->updateSubProductStock($subProduct, $this->quantity);
            if (!$stockUpdated) {
                $this->rollbackReservedAccounts($accountsToSell);
                $this->refundCustomerBalance($this->customerId, $totalPrice);
                return;
            }

        } catch (Exception $e) {
            // Rollback SubProduct stock nếu đã cập nhật
            if (isset($subProduct) && isset($this->quantity)) {
                $this->rollbackSubProductStock($subProduct, $this->quantity);
            }
            
            throw $e;
        }

        echo "==========================================End JobProcessPurchase==========================================" . PHP_EOL;
    }

    private function validatePurchaseData($subProductService, $customerService): array
    {
        $subProduct = $subProductService->getById($this->subProductId);

        if (empty($subProduct)) {
            return [
                'valid' => false,
                'message' => "SubProduct not found: " . $this->subProductId
            ];
        }

        if ($subProduct->status !== SubProducts::STATUS['ACTIVE']) {
            return [
                'valid' => false,
                'message' => "SubProduct is not active: " . $this->subProductId
            ];
        }

        $customer = $customerService->findById($this->customerId);

        if (empty($customer)) {
            return [
                'valid' => false,
                'message' => "Customer not found: " . $this->customerId
            ];
        }

        if ($customer->status !== Customers::STATUS['ACTIVE']) {
            return [
                'valid' => false,
                'message' => "Customer is not active: " . $this->customerId
            ];
        }

        return [
            'valid' => true,
            'sub_product' => $subProduct,
            'customer' => $customer
        ];
    }

    /**
     * Lấy số lượng accounts có sẵn để bán (không bao gồm đã reserve)
     * Trả về số lượng nhỏ hơn giữa accounts có sẵn và SubProduct quantity
     */
    private function getAvailableQuantity($subProduct): int
    {
        $availableAccounts = Accounts::where('sub_product_id', $subProduct->_id)
            ->whereNull('customer_id')
            ->whereNull('order_id')
            ->where('status', Accounts::STATUS['LIVE'])
            ->count();
            
        // Trả về số lượng nhỏ hơn giữa accounts có sẵn và SubProduct quantity
        return min($availableAccounts, $subProduct->quantity);
    }

    /**
     * Lấy accounts để bán (quantity đầu tiên) với atomic operation để tránh race condition
     */
    private function getAccountsToSell($subProduct, $quantity)
    {
        $accounts = [];
        $reservedCount = 0;
        $maxAttempts = $quantity * 2; // Tối đa thử 2 lần số lượng cần thiết
        $attempts = 0;
        
        while ($reservedCount < $quantity && $attempts < $maxAttempts) {
            $remaining = $quantity - $reservedCount;
            
            $account = $this->reserveAccount($subProduct->_id, $this->customerId, $this->orderId ?? 'TEMP_' . time());
            
            if ($account) {
                $accounts[] = $account;
                $reservedCount++;
            }
            
            $attempts++;
            
            if ($attempts > 0 && $attempts % 5 == 0 && $reservedCount == 0) {
                break;
            }
        }
        
        if ($reservedCount < $quantity) {
            $this->rollbackReservedAccounts($accounts);
            return [];
        }
        
        return $accounts;
    }
    
    /**
     * Reserve một account bằng atomic operation
     */
    private function reserveAccount($subProductId, $customerId, $orderId)
    {
        try {
            $result = Accounts::raw(function ($collection) use ($subProductId, $customerId, $orderId) {
                return $collection->findOneAndUpdate(
                [
                    'sub_product_id' => $subProductId,
                    'customer_id' => null,
                    'order_id' => null,
                    'status' => Accounts::STATUS['LIVE']
                ],
                [
                    '$set' => [
                        'customer_id' => $customerId,
                        'order_id' => $orderId,
                        'status' => Accounts::STATUS['SOLD'],
                        'reserved_at' => now()->toISOString(),
                        'reserved_by_job' => $this->job->getJobId()
                    ]
                ],
                [
                    'returnDocument' => \MongoDB\Operation\FindOneAndUpdate::RETURN_DOCUMENT_AFTER,
                    'sort' => ['created_at' => 1]
                ]
            );
            });
            
            if ($result) {
                $account = new Accounts();
                $account->fill((array) $result);
                $account->exists = true;
                $account->setAttribute('_id', $result['_id']);
                return $account;
            }
            
            return null;
        } catch (\Exception $e) {
            echo "Error reserving account: " . $e->getMessage() . PHP_EOL;
            return null;
        }
    }

    /**
     * Khấu trừ số dư khách hàng theo cách atomic (chỉ trừ nếu đủ tiền)
     */
    private function deductCustomerBalanceAtomic($customerId, $amount): bool
    {
        try {
            // Bảo đảm _id dùng đúng kiểu ObjectId
            $mongoId = $customerId instanceof \MongoDB\BSON\ObjectId ? $customerId : new \MongoDB\BSON\ObjectId((string) $customerId);
            // Chuẩn hóa amount về số (int/float)
            $amountToDeduct = (float) $amount;

            $updated = Customers::raw(function ($collection) use ($mongoId, $amountToDeduct) {
                return $collection->findOneAndUpdate(
                    [ '_id' => $mongoId, 'balance' => ['$gte' => $amountToDeduct] ],
                    [ '$inc' => [ 'balance' => -$amountToDeduct ] ],
                    [ 'returnDocument' => \MongoDB\Operation\FindOneAndUpdate::RETURN_DOCUMENT_AFTER ]
                );
            });

            return (bool) $updated;
        } catch (\Exception $e) {
            echo "Error deducting customer balance: " . $e->getMessage() . PHP_EOL;
            return false;
        }
    }

    /**
     * Hoàn tiền cho khách hàng (best-effort)
     */
    private function refundCustomerBalance($customerId, $amount): void
    {
        try {
            $mongoId = $customerId instanceof \MongoDB\BSON\ObjectId ? $customerId : new \MongoDB\BSON\ObjectId((string) $customerId);
            $amountToAdd = (float) $amount;

            Customers::raw(function ($collection) use ($mongoId, $amountToAdd) {
                return $collection->findOneAndUpdate(
                    [ '_id' => $mongoId ],
                    [ '$inc' => [ 'balance' => $amountToAdd ] ],
                    [ 'returnDocument' => \MongoDB\Operation\FindOneAndUpdate::RETURN_DOCUMENT_AFTER ]
                );
            });
        } catch (\Exception $e) {
            echo "Error refunding customer balance: " . $e->getMessage() . PHP_EOL;
        }
    }
    
    /**
     * Rollback những accounts đã reserve nếu không đủ số lượng
     */
    private function rollbackReservedAccounts($accounts)
    {
        foreach ($accounts as $account) {
            try {
                $account->update([
                    'customer_id' => null,
                    'order_id' => null,
                    'status' => Accounts::STATUS['LIVE'],
                    'reserved_at' => null,
                    'reserved_by_job' => null
                ]);
            } catch (\Exception $e) {
                echo "Error rolling back account {$account->_id}: " . $e->getMessage() . PHP_EOL;
            }
        }
    }

    /**
     * Rollback SubProduct stock khi có lỗi
     */
    private function rollbackSubProductStock($subProduct, $quantityToAdd)
    {
        try {
            $result = SubProducts::raw(function ($collection) use ($subProduct, $quantityToAdd) {
                return $collection->findOneAndUpdate(
                    ['_id' => $subProduct->_id],
                    [
                        '$inc' => [
                            'quantity' => $quantityToAdd
                        ]
                    ],
                    [
                        'returnDocument' => \MongoDB\Operation\FindOneAndUpdate::RETURN_DOCUMENT_AFTER
                    ]
                );
            });
            
            if ($result && isset($result['quantity'])) {
                echo "Rolled back SubProduct stock: +{$quantityToAdd}, New quantity: {$result['quantity']}" . PHP_EOL;
            }
        } catch (\Exception $e) {
            echo "Error rolling back SubProduct stock: " . $e->getMessage() . PHP_EOL;
        }
    }
    
    /**
     * Cleanup những accounts đã reserve quá lâu (stale reservations)
     */
    private function cleanupStaleReservations($subProductId)
    {
        try {
            $staleTime = now()->subMinutes(10); // 10 phút trước
            
            $staleAccounts = Accounts::where('sub_product_id', $subProductId)
                ->whereNotNull('reserved_at')
                ->where('reserved_at', '<', $staleTime)
                ->where('status', Accounts::STATUS['SOLD'])
                ->whereNotNull('customer_id')
                ->whereNotNull('order_id')
                ->get();
                
            foreach ($staleAccounts as $account) {
                $account->update([
                    'customer_id' => null,
                    'order_id' => null,
                    'status' => Accounts::STATUS['LIVE'],
                    'reserved_at' => null,
                    'reserved_by_job' => null
                ]);
            }
            
            if ($staleAccounts->count() > 0) {
                echo "Cleaned up {$staleAccounts->count()} stale reservations" . PHP_EOL;
            }
        } catch (\Exception $e) {
            echo "Error cleaning up stale reservations: " . $e->getMessage() . PHP_EOL;
        }
    }

    /**
     * Cập nhật stock SubProduct với atomic operation để tránh race condition
     */
    private function updateSubProductStock($subProduct, $quantityToSubtract): bool
    {
        try {
            // Update thường bằng Eloquent với điều kiện còn đủ tồn
            $matched = SubProducts::where('_id', $subProduct->_id)
                ->where('quantity', '>=', (int) $quantityToSubtract)
                ->decrement('quantity', (int) $quantityToSubtract);

            if ($matched === 0) {
                return false;
            }

            return true;
        } catch (\Exception $e) {
            echo "Error updating SubProduct stock: " . $e->getMessage() . PHP_EOL;
            return false;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(Exception $exception): void
    {
        echo "Error: " . $exception->getMessage() . PHP_EOL;
    }
}
