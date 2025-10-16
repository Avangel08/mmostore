<?php

namespace App\Services\Order;

use App\Jobs\Systems\JobProcessPurchase;
use App\Models\Mongo\Orders;
use App\Services\Product\ProductService;
use App\Services\Product\SubProductService;

class CheckoutService
{
    protected $productService;
    protected $subProductService;

    public function __construct(ProductService $productService, SubProductService $subProductService)
    {
        $this->productService = $productService;
        $this->subProductService = $subProductService;
    }

    /**
     * Perform checkout: validate, create pending order, dispatch processing job.
     *
     * @return array{success:bool,message?:string,order?:Orders,order_number?:string}
     */
    public function checkout(string $productId, string $subProductId, string $customerId, int $quantity, string $storeId, string $sourceKey): array
    {
        try {
            $orderNumber = $this->generateOrderNumber();

            $order = $this->createPendingOrder($productId, $subProductId, $customerId, $quantity, $orderNumber);
            if (!$order) {
                return [
                    'success' => false,
                    'message' => 'Failed to create order',
                ];
            }

            JobProcessPurchase::dispatch(
                $productId,
                $subProductId,
                $customerId,
                $quantity,
                $storeId,
                $order->_id,
                $sourceKey
            );

            return [
                'success' => true,
                'order' => $order,
                'order_number' => $orderNumber,
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Error processing purchase request: ' . $e->getMessage(),
            ];
        }
    }

    protected function generateOrderNumber(): string
    {
        $letters = strtoupper(substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 3));
        $timestamp = time();
        $randomNumbers = str_pad(mt_rand(0, 99999), 5, '0', STR_PAD_LEFT);
        return $letters . $timestamp . $randomNumbers;
    }

    protected function createPendingOrder(string $productId, string $subProductId, string $customerId, int $quantity, string $orderNumber): ?Orders
    {
        try {
            $subProduct = $this->subProductService->getById($subProductId);
            if (!$subProduct) {
                return null;
            }

            if ($subProduct->quantity < $quantity) {
                return null;
            }

            $product = $this->productService->getById($productId);
            if (!$product) {
                return null;
            }

            $unitPrice = $subProduct->price;
            $totalPrice = $unitPrice * $quantity;

            $order = Orders::create([
                'customer_id' => $customerId,
                'product_id' => $productId,
                'sub_product_id' => $subProductId,
                'category_id' => $product->category_id,
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'total_price' => $totalPrice,
                'order_number' => $orderNumber,
                'status' => Orders::STATUS['PENDING'],
                'payment_status' => Orders::PAYMENT_STATUS['PENDING'],
                'notes' => 'Order created - pending payment'
            ]);

            return $order;
        } catch (\Exception $e) {
            return null;
        }
    }
}


