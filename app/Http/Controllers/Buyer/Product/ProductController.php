<?php

namespace App\Http\Controllers\Buyer\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Buyer\Product\CheckoutProductRequest;
use App\Models\Mongo\Categories;
use App\Models\Mongo\Orders;
use App\Models\Mongo\SubProducts;
use App\Services\Product\ProductService;
use App\Services\Product\SubProductService;
use App\Jobs\Systems\JobProcessPurchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{

    protected $productService;
    protected $categoryService;
    protected $subProductService;

    public function __construct(ProductService $productService, SubProductService $subProductService)
    {
        $this->productService = $productService;
        $this->subProductService = $subProductService;
    }

    public function show(Request $request)
    {
        $categories = Categories::with([
            'products' => function ($query) {
                $query->latest()->with(['subProducts']);
            }
        ])->get();
        $result = $categories->map(function ($category) {
            return [
                'id' => $category->_id,
                'name' => $category->name,
                'columns' => [
                    ['key' => 'id', 'name' => 'ID'],
                    ['key' => 'title', 'name' => $category->name],
                    ['key' => 'price', 'name' => 'Price'],
                    ['key' => 'quantity', 'name' => 'Quantity'],
                    ['key' => 'action', 'name' => 'Action'],
                ],
                'products' => $category->products->map(function ($product) {
                    return [
                        'id' => $product->_id,
                        'title' => $product->name,
                        'short_description' => $product->short_description,
                        'price' => $product->subProducts->min('price') ?? 0,
                        'quantity' => $product->subProducts->min('total_product') ?? 0,
                        'image' => $product->image,
                        'sub_products' => $product->subProducts
                    ];
                })
            ];
        });

        return response()->json($result);
    }

    public function detail(String $productId)
    {
        $product = $this->productService->getById($productId, ['*'], ['subProducts']);
        return response()->json($product);
    }

    public function checkout(Request $request)
    {
        try {
            $request->validate([
                'product_id' => 'required|string',
                'sub_product_id' => 'required|string',
                'quantity' => 'required|integer|min:1',
            ]);

            $store = $request->input("current_store");

            $customer = Auth::guard('buyer')->user();

            if (!$customer) {
                return response()->json([
                    'success' => false,
                    'message' => 'Customer not authenticated'
                ], 401);
            }

            $productId = $request->input('product_id');
            $subProductId = $request->input('sub_product_id');
            $quantity = $request->input('quantity');

            $orderId = $this->generateOrderNumber();

            $order = $this->createPendingOrder(
                $productId,
                $subProductId,
                $customer->_id,
                $quantity,
                $orderId
            );

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to create order'
                ], 500);
            }

            JobProcessPurchase::dispatch(
                $productId,
                $subProductId,
                $customer->_id,
                $quantity,
                $store->id,
                $order->_id,
                'sub_product'
            );

            return response()->json([
                'success' => true,
                'message' => 'Order created and payment processing started',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error processing purchase request: ' . $e->getMessage()
            ], 500);
        }
    }

    public function generateOrderNumber()
    {
        $letters = strtoupper(substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 3));
        $timestamp = time();
        $randomNumbers = str_pad(mt_rand(0, 99999), 5, '0', STR_PAD_LEFT);
        return $letters . $timestamp . $randomNumbers;
    }

    private function createPendingOrder($productId, $subProductId, $customerId, $quantity, $orderNumber)
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
