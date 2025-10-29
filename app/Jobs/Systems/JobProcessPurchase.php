<?php

namespace App\Jobs\Systems;

use App\Models\Mongo\Customers;
use App\Models\Mongo\PaymentMethodSeller;
use App\Models\Mongo\SubProducts;
use App\Models\Mongo\Accounts;
use App\Models\Mongo\BalanceHistories;
use App\Models\Mongo\Orders;
use App\Models\Mongo\Products;
use App\Models\Mongo\Categories;
use App\Services\Customer\CustomerService;
use App\Services\PaymentMethodSeller\PaymentMethodSellerService;
use App\Services\Product\SubProductService;
use App\Services\Product\ProductService;
use App\Services\Category\CategoryService;
use App\Services\BalanceHistory\BalanceHistoryService;
use App\Services\Order\OrderService;
use App\Services\Setting\SettingService;
use App\Services\Tenancy\TenancyService;
use App\Services\Home\StoreService;
use App\Services\CurrencyRateSeller\CurrencyRateSellerService;
use App\Services\Notification\TelegramNotificationService;
use App\Models\Mongo\Settings;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Exception;
use Illuminate\Support\Facades\Redis;
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
    protected $sourceKey;

    public $timeout = 120;

    public function __construct(
        $productId,
        $subProductId,
        $customerId,
        $quantity,
        $storeId,
        $orderId = null,
        $sourceKey = null,
    ) {
        $this->productId = $productId;
        $this->subProductId = $subProductId;
        $this->customerId = $customerId;
        $this->quantity = $quantity;
        $this->storeId = $storeId;
        $this->orderId = $orderId;
        $this->sourceKey = $sourceKey;
        $this->queue = 'process_purchase';
    }


    public function handle(
        SubProductService $subProductService,
        CustomerService $customerService,
        ProductService $productService,
        CategoryService $categoryService,
        BalanceHistoryService $balanceHistoryService,
        OrderService $orderService,
        StoreService $storeService,
        TenancyService $tenancyService,
        CurrencyRateSellerService $currencyRateSellerService,
        PaymentMethodSellerService $paymentMethodSellerService,
        SettingService $settingService
    ): void {
        try {
            $store = $storeService->findById($this->storeId);
            if (empty($store)) {
                $this->updateOrderToFailed("Cửa hàng không tồn tại");
                return;
            }

            try {
                $connection = $tenancyService->buildConnectionFromStore($store);
                $tenancyService->applyConnection($connection, true);
            } catch (\Throwable $th) {
                $this->updateOrderToFailed("Kết nối dữ liệu bị lỗi");
                return;
            }

            $order = $orderService->findById($this->orderId);
            if (empty($order)) {
                $this->updateOrderToFailed("Đơn hàng không tồn tại");
                return;
            }

            if ($order->status !== Orders::STATUS['PENDING']) {
                $this->updateOrderToFailed("Đơn hàng không ở trạng thái chờ");
                return;
            }

            if ($order->payment_status !== Orders::PAYMENT_STATUS['PENDING']) {
                $this->updateOrderToFailed("Đơn hàng không ở trạng thái chờ - 2");
                return;
            }
            
            $validationResult = $this->validatePurchaseData($subProductService, $customerService, $productService, $categoryService);

            if (!$validationResult['valid']) {
                $this->updateOrderToFailed($validationResult['message'] ?? "E100");
                return;
            }

            $subProduct = $validationResult['sub_product'];
            $totalPrice = $subProduct->price * $this->quantity;

            $availableQuantity = $this->getAvailableQuantity($subProduct);

            if ($availableQuantity < $this->quantity) {
                $this->updateOrderToFailed("Số lượng hiện có không đủ");
                return;
            }

            // Lấy account data trước khi xử lý payment
            $accountsToSell = $this->getAccountsToSell($subProduct, $this->quantity);
            if (count($accountsToSell) < $this->quantity) {
                $this->rollbackReservedAccounts($accountsToSell);
                $this->updateOrderToFailed("Số lượng hiện có không đủ");
                return;
            }

            // Lưu account data vào Redis ngay sau khi lấy được
            $this->storeAccountDataToRedis($accountsToSell);

            // Xử lý payment sau khi đã có account data
            $deductResult = $this->deductCustomerBalanceAtomic($this->customerId, $totalPrice);
            if (!$deductResult['success']) {
                $this->rollbackReservedAccounts($accountsToSell);
                $this->updateOrderToFailed("Số dư không đủ");
                return;
            }

            try {
                // Get payment method
                $method = $paymentMethodSellerService->findByKey(PaymentMethodSeller::KEY['BALANCE']);
                if (!$method) {
                    $this->rollbackReservedAccounts($accountsToSell);
                    $this->refundCustomerBalance($this->customerId, $totalPrice);
                    $this->updateOrderToFailed("Phương thức thanh toán không tồn tại");
                    return;
                }
                $paymentMethodId = $method->_id;

                // Validate source key
                if (!isset(BalanceHistories::GATEWAY[$this->sourceKey])) {
                    $this->rollbackReservedAccounts($accountsToSell);
                    $this->refundCustomerBalance($this->customerId, $totalPrice);
                    $this->updateOrderToFailed("Loại thanh toán không tồn tại");
                    return;
                }
                $gateWay = BalanceHistories::GATEWAY[$this->sourceKey];

                // Get currency settings
                $currencySetting = $settingService->findByKey('currency');
                if (!$currencySetting) {
                    $this->rollbackReservedAccounts($accountsToSell);
                    $this->refundCustomerBalance($this->customerId, $totalPrice);
                    $this->updateOrderToFailed("Cửa hàng chưa cấu hình tiền tệ");
                    return;
                }
                $storeCurrency = $currencySetting->value ?? Settings::CURRENCY['VND'];

                // Currency conversion
                try {
                    if ($storeCurrency === Settings::CURRENCY['USD']) {
                        $amountUsd = (float) $totalPrice;
                        $amountVnd = $currencyRateSellerService->convertUSDToVND($amountUsd);
                    } else {
                        $amountVnd = (float) $totalPrice;
                        $amountUsd = $currencyRateSellerService->convertVNDToUSD($amountVnd);
                    }
                } catch (\Exception $e) {
                    $this->rollbackReservedAccounts($accountsToSell);
                    $this->refundCustomerBalance($this->customerId, $totalPrice);
                    $this->updateOrderToFailed("Chuyển đổi tiền tệ bị lỗi");
                    return;
                }

                // Create balance history
                try {
                    $balanceHistory = $balanceHistoryService->create([
                        'customer_id' => $this->customerId,
                        'payment_method_id' => $paymentMethodId,
                        'type' => BalanceHistories::TYPE['purchase'],
                        'amount' => $amountUsd,
                        'amount_vnd' => $amountVnd,
                        'before' => $deductResult['before'] ?? null,
                        'after' => $deductResult['after'] ?? null,
                        'description' => "{$subProduct->name}, {$this->quantity}",
                        'date_at' => now(),
                        'transaction' => $order->order_number ?? 'PURCHASE_' . time(),
                        'gate_way' => $gateWay,
                    ]);

                    if (!$balanceHistory) {
                        $this->rollbackReservedAccounts($accountsToSell);
                        $this->refundCustomerBalance($this->customerId, $totalPrice);
                        $this->updateOrderToFailed("Lỗi tạo lịch sử giao dịch");
                        return;
                    }

                    // Send notification Telegram using unified `notification` settings
                    try {
                        $telegramService = new TelegramNotificationService($settingService);
                        $orderData = [
                            'order_number' => $order->order_number,
                            'total_price' => number_format($totalPrice, 0, ',', '.') . ' VND',
                            'quantity' => $this->quantity,
                            'paid_time' => now()->format('Y-m-d H:i:s'),
                            'product_name' => $subProduct->name ?? 'N/A'
                        ];
                        $telegramService->sendOrderNotification($orderData);
                    } catch (\Exception $e) {
                    }
                } catch (\Exception $e) {
                    $this->rollbackReservedAccounts($accountsToSell);
                    $this->refundCustomerBalance($this->customerId, $totalPrice);
                    $this->updateOrderToFailed("Lỗi tạo lịch sử giao dịch - 2");
                    return;
                }
            } catch (\Exception $e) {
                $this->rollbackReservedAccounts($accountsToSell);
                $this->refundCustomerBalance($this->customerId, $totalPrice);
                $this->updateOrderToFailed("Thanh toán lỗi");
                return;
            }

            // Update accounts with order ID
            if ($this->orderId) {
                try {
                    foreach ($accountsToSell as $account) {
                        $updated = $account->update([
                            'order_id' => $this->orderId
                        ]);
                        if (!$updated) {
                            $this->rollbackReservedAccounts($accountsToSell);
                            $this->refundCustomerBalance($this->customerId, $totalPrice);
                            $this->updateOrderToFailed("Lỗi cập nhật tài nguyên");
                            return;
                        }
                    }
                } catch (\Exception $e) {
                    $this->rollbackReservedAccounts($accountsToSell);
                    $this->refundCustomerBalance($this->customerId, $totalPrice);
                    $this->updateOrderToFailed("Lỗi cập nhật tài nguyên - 2");
                    return;
                }
            }

            // Update sub-product stock
            $stockUpdated = $this->updateSubProductStock($subProduct, $this->quantity);
            if (!$stockUpdated) {
                $this->rollbackReservedAccounts($accountsToSell);
                $this->refundCustomerBalance($this->customerId, $totalPrice);
                $this->updateOrderToFailed("Lỗi cập nhật kho");
                return;
            }

            // Complete the order
            $orderCompleted = $this->updateOrderRecord($orderService, $subProduct, $totalPrice);
            if (!$orderCompleted) {
                $this->rollbackReservedAccounts($accountsToSell);
                $this->refundCustomerBalance($this->customerId, $totalPrice);
                $this->rollbackSubProductStock($subProduct, $this->quantity);
                $this->updateOrderToFailed("Đơn hàng lỗi");
                return;
            }

        } catch (Exception $e) {
            // Rollback any changes made
            if (isset($subProduct) && isset($this->quantity)) {
                $this->rollbackSubProductStock($subProduct, $this->quantity);
            }

            // Rollback reserved accounts if they were reserved
            if (isset($accountsToSell)) {
                $this->rollbackReservedAccounts($accountsToSell);
            }

            // Refund customer balance if it was deducted
            if (isset($totalPrice)) {
                $this->refundCustomerBalance($this->customerId, $totalPrice);
            }

            // Update order to failed
            $this->updateOrderToFailed("System error");
            
            // Re-throw the exception to mark job as failed
            throw $e;
        }
    }

    private function validatePurchaseData($subProductService, $customerService, $productService, $categoryService): array
    {
        // Validate sub-product
        $subProduct = $subProductService->getById($this->subProductId);
        if (!$subProduct) {
            return [
                'valid' => false,
                'message' => 'Sản phẩm không tồn tại'
            ];
        }

        if ($subProduct->status !== SubProducts::STATUS['ACTIVE']) {
            return [
                'valid' => false,
                'message' => 'Sản phẩm không hoạt động'
            ];
        }

        if ($subProduct->quantity < $this->quantity) {
            return [
                'valid' => false,
                'message' => 'Số lượng sản phẩm không đủ'
            ];
        }

        // Validate product
        $product = $productService->getById($this->productId);
        if (!$product) {
            return [
                'valid' => false,
                'message' => 'Sản phẩm không tồn tại'
            ];
        }

        if ($product->status !== Products::STATUS['ACTIVE']) {
            return [
                'valid' => false,
                'message' => 'Sản phẩm không hoạt động'
            ];
        }

        // Validate category
        $category = $categoryService->getById($product->category_id);
        if (!$category) {
            return [
                'valid' => false,
                'message' => 'Danh mục không tồn tại'
            ];
        }

        if ($category->status !== Categories::STATUS['ACTIVE']) {
            return [
                'valid' => false,
                'message' => 'Danh mục không hoạt động'
            ];
        }

        // Validate customer
        $customer = $customerService->findById($this->customerId);
        if (!$customer) {
            return [
                'valid' => false,
                'message' => 'Người dùng không tồn tại'
            ];
        }

        if ($customer->status !== Customers::STATUS['ACTIVE']) {
            return [
                'valid' => false,
                'message' => 'Người dùng không hoạt động'
            ];
        }

        // Validate customer balance
        $totalPrice = $subProduct->price * $this->quantity;
        if ($customer->balance < $totalPrice) {
            return [
                'valid' => false,
                'message' => 'Số dư không đủ'
            ];
        }

        return [
            'valid' => true,
            'sub_product' => $subProduct,
            'customer' => $customer,
            'product' => $product,
            'category' => $category
        ];
    }

    private function getAvailableQuantity($subProduct): int
    {
        $availableAccounts = Accounts::where('sub_product_id', $subProduct->_id)
            ->whereNull('customer_id')
            ->whereNull('order_id')
            ->where('status', Accounts::STATUS['LIVE'])
            ->count();
            
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

            $account = $this->reserveAccountWithRedisCheck($subProduct->_id, $this->customerId, $this->orderId ?? 'TEMP_' . time());
            
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

    private function reserveAccountWithRedisCheck($subProductId, $customerId, $orderId)
    {
        try {
            // Tạo key Redis cho cặp sản phẩm-account
            $redisKey = "product_account:{$subProductId}";
            
            // Kiểm tra xem đã có account nào được cache cho sản phẩm này chưa
            $cachedAccount = Redis::get($redisKey);

            if ($cachedAccount) {
                // Nếu đã có account trong Redis, lấy account khác
                $account = $this->getNextAvailableAccount($subProductId, $customerId, $orderId);
            } else {
                // Nếu chưa có, lấy account đầu tiên và lưu vào Redis
                $account = $this->reserveAccount($subProductId, $customerId, $orderId);
                
                if ($account) {
                    // Lưu account data vào Redis với TTL 1 giờ
                    $accountData = [
                        'id' => (string) $account->_id,
                        'key' => $account->key,
                        'data' => $account->data,
                        'sub_product_id' => (string) $account->sub_product_id,
                        'reserved_at' => now()->toISOString()
                    ];
                    
                    Redis::setex($redisKey, 3600, json_encode($accountData));
                }
            }
            
            return $account;
        } catch (\Exception $e) {
            return null;
        }
    }

    private function getNextAvailableAccount($subProductId, $customerId, $orderId)
    {
        try {
            // Lấy account tiếp theo (không phải account đã cache)
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
                            'reserved_at' => now()->toISOString()
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
            return null;
        }
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
                            'reserved_at' => now()->toISOString()
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
            return null;
        }
    }

    private function deductCustomerBalanceAtomic($customerId, $amount): array
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

            if (!$updated || !isset($updated['balance'])) {
                return ['success' => false];
            }

            $after = (float) $updated['balance'];
            $before = $after + $amountToDeduct;

            return [
                'success' => true,
                'before' => $before,
                'after' => $after,
            ];
        } catch (\Exception $e) {
            return ['success' => false];
        }
    }

    private function refundCustomerBalance($customerId, $amount): void
    {
        $mongoId = $customerId instanceof ObjectId ? $customerId : new ObjectId((string) $customerId);
        $amountToAdd = (float) $amount;

        Customers::raw(function ($collection) use ($mongoId, $amountToAdd) {
            return $collection->findOneAndUpdate(
                [ '_id' => $mongoId ],
                [ '$inc' => [ 'balance' => $amountToAdd ] ],
                [ 'returnDocument' => FindOneAndUpdate::RETURN_DOCUMENT_AFTER ]
            );
        });
    }

    private function rollbackReservedAccounts($accounts)
    {
        foreach ($accounts as $account) {
            $account->update([
                'customer_id' => null,
                'order_id' => null,
                'status' => Accounts::STATUS['LIVE'],
                'reserved_at' => null
            ]);
        }
        
        // Xóa Redis cache nếu có
        if ($this->orderId) {
            $orderRedisKey = "order_accounts:{$this->orderId}";
            Redis::del($orderRedisKey);
        }
    }

    private function rollbackSubProductStock($subProduct, $quantityToAdd)
    {
        SubProducts::raw(function ($collection) use ($subProduct, $quantityToAdd) {
            return $collection->findOneAndUpdate(
                ['_id' => $subProduct->_id],
                [
                    '$inc' => [
                        'quantity' => $quantityToAdd
                    ]
                ],
                [
                    'returnDocument' => FindOneAndUpdate::RETURN_DOCUMENT_AFTER
                ]
            );
        });
    }


    private function updateSubProductStock($subProduct, $quantityToSubtract): bool
    {
        try {
            $matched = SubProducts::where('_id', $subProduct->_id)
                ->where('quantity', '>=', (int) $quantityToSubtract)
                ->decrement('quantity', (int) $quantityToSubtract);

            if ($matched === 0) {
                return false;
            }

            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    private function updateOrderRecord($orderService, $subProduct, $totalPrice): bool
    {
        try {
            $order = Orders::where('_id', $this->orderId)
                ->where('status', Orders::STATUS['PENDING'])
                ->where('payment_status', Orders::PAYMENT_STATUS['PENDING'])
                ->first();

            if (!$order) {
                return false;
            }

            $updated = $order->update([
                'status' => Orders::STATUS['COMPLETED'],
                'payment_status' => Orders::PAYMENT_STATUS['PAID'],
                'notes' => "Order completed - Payment successful"
            ]);

            if (!$updated) {
                return false;
            }

            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    private function updateOrderToFailed($reason = 'Purchase failed')
    {
        if (!$this->orderId) {
            return;
        }

        try {
            $order = Orders::where('_id', $this->orderId)->first();

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

    private function storeAccountDataToRedis($accounts)
    {
        $orderRedisKey = "order_accounts:{$this->orderId}";
        $accountData = [];

        foreach ($accounts as $account) {
            $accountData[] = [
                'id' => (string) $account->_id,
                'key' => $account->key,
                'data' => $account->data,
                'sub_product_id' => (string) $account->sub_product_id,
                'reserved_at' => $account->reserved_at ?? now()->toISOString()
            ];
        }

        // Lưu account data vào Redis với TTL 24 giờ
        Redis::setex($orderRedisKey, 86400, json_encode($accountData));
    }

    public function failed(\Throwable $exception): void
    {
        if ($this->storeId) {
            $storeService = app(StoreService::class);
            $tenancyService = app(TenancyService::class);

            $store = $storeService->findById($this->storeId);
            if ($store) {
                $connection = $tenancyService->buildConnectionFromStore($store);
                $tenancyService->applyConnection($connection, true);
            }
        }

        $this->updateOrderToFailed('Lỗi khác');
    }
}
