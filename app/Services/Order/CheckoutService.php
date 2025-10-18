<?php

namespace App\Services\Order;

use App\Jobs\Systems\JobProcessPurchase;
use App\Models\Mongo\Categories;
use App\Models\Mongo\Customers;
use App\Models\Mongo\Orders;
use App\Models\Mongo\Products;
use App\Models\Mongo\SubProducts;
use App\Services\Product\ProductService;
use App\Services\Product\SubProductService;
use App\Services\Category\CategoryService;
use App\Services\Customer\CustomerService;
use Illuminate\Http\Response;

class CheckoutService
{
    protected $productService;
    protected $subProductService;
    protected $categoryService;
    protected $customerService;

    public function __construct(ProductService $productService, SubProductService $subProductService, CategoryService $categoryService, CustomerService $customerService)
    {
        $this->productService = $productService;
        $this->subProductService = $subProductService;
        $this->categoryService = $categoryService;
        $this->customerService = $customerService;
    }

    public function checkout(string $productId, string $subProductId, string $customerId, int $quantity, string $storeId, string $sourceKey): array
    {
        try {
            $validationResult = $this->validateEntitiesAreActive($productId, $subProductId, $customerId, $quantity);
            if (!$validationResult['success']) {
                return [
                    'status' => 'error',
                    'message' => $validationResult['message'],
                    'code' => Response::HTTP_BAD_REQUEST
                ];
            }

            $orderNumber = $this->generateOrderNumber();

            $order = $this->createPendingOrder($productId, $subProductId, $customerId, $quantity, $orderNumber);
            if (!$order) {
                return [
                    'status' => 'error',
                    'message' => 'Failed to create order',
                    'code' => Response::HTTP_INTERNAL_SERVER_ERROR
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
                'status' => 'success',
                'message' => 'Order created successfully',
                'data' => [
                    'order' => $order,
                    'order_number' => $orderNumber,
                ],
                'code' => Response::HTTP_CREATED
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => 'Error processing purchase request: ' . $e->getMessage(),
                'code' => Response::HTTP_INTERNAL_SERVER_ERROR
            ];
        }
    }

    protected function validateEntitiesAreActive(string $productId, string $subProductId, string $customerId, int $quantity): array
    {
        // Validate sub product
        $subProduct = $this->subProductService->getById($subProductId);
        if (!$subProduct) {
            return [
                'success' => false,
                'message' => 'Sub product not found',
            ];
        }

        if ($subProduct->status !== SubProducts::STATUS['ACTIVE']) {
            return [
                'success' => false,
                'message' => 'Sub product is inactive',
            ];
        }

        // Validate stock quantity
        if ($subProduct->quantity < $quantity) {
            return [
                'success' => false,
                'message' => 'Số lượng sản phẩm không đủ',
            ];
        }

        // Validate product
        $product = $this->productService->getById($productId);
        if (!$product) {
            return [
                'success' => false,
                'message' => 'Product not found',
            ];
        }

        if ($product->status !== Products::STATUS['ACTIVE']) {
            return [
                'success' => false,
                'message' => 'Product is inactive',
            ];
        }

        // Validate category
        $category = $this->categoryService->getById($product->category_id);
        if (!$category) {
            return [
                'success' => false,
                'message' => 'Category not found',
            ];
        }

        if ($category->status !== Categories::STATUS['ACTIVE']) {
            return [
                'success' => false,
                'message' => 'Category is inactive',
            ];
        }

        // Validate customer
        $customer = $this->customerService->findById($customerId);
        if (!$customer) {
            return [
                'success' => false,
                'message' => 'Customer not found',
            ];
        }

        if ($customer->status !== Customers::STATUS['ACTIVE']) {
            return [
                'success' => false,
                'message' => 'Customer is inactive',
            ];
        }

        // Validate customer balance
        $totalPrice = $subProduct->price * $quantity;
        if ($customer->balance < $totalPrice) {
            return [
                'success' => false,
                'message' => 'Số dư không đủ',
            ];
        }

        return [
            'success' => true,
        ];
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


