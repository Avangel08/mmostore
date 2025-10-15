<?php

namespace App\Jobs\Systems;

use App\Models\Mongo\Customers;
use App\Models\Mongo\SubProducts;
use App\Models\Mongo\Accounts;
use App\Models\Mongo\BalanceHistories;
use App\Models\Mongo\Orders;
use App\Services\Customer\CustomerService;
use App\Services\Product\SubProductService;
use App\Services\BalanceHistory\BalanceHistoryService;
use App\Services\Order\OrderService;
use App\Services\Tenancy\TenancyService;
use App\Services\Home\StoreService;
use Illuminate\Queue\Middleware\WithoutOverlapping;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Exception;
use MongoDB\BSON\ObjectId;
use MongoDB\Operation\FindOneAndUpdate;

class JobProcessPurchase implements ShouldQueue
{
    use Queueable;

    protected $productId;
    protected $subProductId;
    protected $customerId;
    protected $quantity;
    protected $storeId;
    protected $orderId;

    public $uniqueFor = 300;
    public $timeout = 120;

    public function __construct(
        $productId,
        $subProductId,
        $customerId,
        $quantity,
        $storeId,
        $orderId = null,
    ) {
        $this->productId = $productId;
        $this->subProductId = $subProductId;
        $this->customerId = $customerId;
        $this->quantity = $quantity;
        $this->storeId = $storeId;
        $this->orderId = $orderId;
        $this->queue = 'process_purchase';
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

    public function handle(
        SubProductService $subProductService,
        CustomerService $customerService,
        BalanceHistoryService $balanceHistoryService,
        OrderService $orderService,
        StoreService $storeService,
        TenancyService $tenancyService
    ): void {
        try {
            $store = $storeService->findById($this->storeId);

            if (empty($store)) {
                echo "Store not found" . PHP_EOL;
                $this->updateOrderToFailed("Store not found");
                return;
            }

            $connection = $tenancyService->buildConnectionFromStore($store);
            $tenancyService->applyConnection($connection, true);
            
            $this->cleanupStaleReservations($this->subProductId);
            
            $validationResult = $this->validatePurchaseData($subProductService, $customerService);

            if (!$validationResult['valid']) {
                echo "Validation failed: " . $validationResult['message'] . PHP_EOL;
                $this->updateOrderToFailed("Lỗi khác - E103");
                return;
            }

            $subProduct = $validationResult['sub_product'];

            $availableQuantity = $this->getAvailableQuantity($subProduct);

            if ($availableQuantity < $this->quantity) {
                $this->updateOrderToFailed("Số lượng hiện có không đủ");
                return;
            }

            if ($subProduct->quantity < $this->quantity) {
                $this->updateOrderToFailed("Số lượng sản phẩm không đủ");
                return;
            }

            $totalPrice = $subProduct->price * $this->quantity;

            $deducted = $this->deductCustomerBalanceAtomic($this->customerId, $totalPrice);
            if (!$deducted) {
                $this->updateOrderToFailed("Số dư không đủ");
                return;
            }

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
                $this->refundCustomerBalance($this->customerId, $totalPrice);
                $this->updateOrderToFailed("Lỗi khác - E101");
                return;
            }

            $accountsToSell = $this->getAccountsToSell($subProduct, $this->quantity);
            if (count($accountsToSell) < $this->quantity) {
                $this->rollbackReservedAccounts($accountsToSell);
                $this->refundCustomerBalance($this->customerId, $totalPrice);
                $this->updateOrderToFailed("Hết tài nguyên");
                return;
            }

            if ($this->orderId) {
                foreach ($accountsToSell as $account) {
                    $account->update([
                        'order_id' => $this->orderId
                    ]);
                }
            }

            $stockUpdated = $this->updateSubProductStock($subProduct, $this->quantity);
            if (!$stockUpdated) {
                $this->rollbackReservedAccounts($accountsToSell);
                $this->refundCustomerBalance($this->customerId, $totalPrice);
                $this->updateOrderToFailed("Lỗi khác - E102");
                return;
            }

            try {
                $this->updateOrderRecord($orderService, $subProduct, $totalPrice);
            } catch (\Exception $e) {
            }

        } catch (Exception $e) {
            if (isset($subProduct) && isset($this->quantity)) {
                $this->rollbackSubProductStock($subProduct, $this->quantity);
            }
            
            throw $e;
        }
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
                        'returnDocument' => FindOneAndUpdate::RETURN_DOCUMENT_AFTER,
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

    private function deductCustomerBalanceAtomic($customerId, $amount): bool
    {
        try {
            $mongoId = $customerId instanceof ObjectId ? $customerId : new ObjectId((string) $customerId);
            $amountToDeduct = (float) $amount;

            $updated = Customers::raw(function ($collection) use ($mongoId, $amountToDeduct) {
                return $collection->findOneAndUpdate(
                    [ '_id' => $mongoId, 'balance' => ['$gte' => $amountToDeduct] ],
                    [ '$inc' => [ 'balance' => -$amountToDeduct ] ],
                    [ 'returnDocument' => FindOneAndUpdate::RETURN_DOCUMENT_AFTER ]
                );
            });

            return (bool) $updated;
        } catch (\Exception $e) {
            echo "Error deducting customer balance: " . $e->getMessage() . PHP_EOL;
            return false;
        }
    }

    private function refundCustomerBalance($customerId, $amount): void
    {
        try {
            $mongoId = $customerId instanceof ObjectId ? $customerId : new ObjectId((string) $customerId);
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

    private function updateOrderRecord($orderService, $subProduct, $totalPrice)
    {
        try {
            $order = Orders::where('_id', $this->orderId)
                ->where('status', Orders::STATUS['PENDING'])
                ->where('payment_status', Orders::PAYMENT_STATUS['PENDING'])
                ->first();

            if (!$order) {
                echo "Order not found for order_number: {$this->orderId}" . PHP_EOL;
                return null;
            }

            $order->update([
                'status' => Orders::STATUS['COMPLETED'],
                'payment_status' => Orders::PAYMENT_STATUS['PAID'],
                'notes' => "Order completed via JobProcessPurchase - Payment successful"
            ]);

            return $order;
        } catch (\Exception $e) {
            echo "Error in updateOrderRecord: " . $e->getMessage() . PHP_EOL;
            return null;
        }
    }

    private function updateOrderToFailed($reason = 'Purchase failed')
    {
        if (!$this->orderId) {
            return;
        }

        try {
            $order = Orders::where('_id', $this->orderId)
                ->where('status', Orders::STATUS['PENDING'])
                ->where('payment_status', Orders::PAYMENT_STATUS['PENDING'])
                ->first();

            if (!$order) {
                return;
            }

            $order->update([
                'status' => Orders::STATUS['FAILED'],
                'payment_status' => Orders::PAYMENT_STATUS['FAILED'],
                'notes' => $reason
            ]);
        } catch (\Exception $e) {

        }
    }
}
