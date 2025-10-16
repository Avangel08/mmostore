<?php

namespace App\Http\Controllers\Buyer\Product;

use App\Http\Controllers\Controller;
use App\Models\Mongo\PaymentMethodSeller;
use App\Services\Order\CheckoutService;
use App\Services\Category\CategoryService;
use App\Services\Product\ProductService;
use App\Services\Product\SubProductService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{

    protected $productService;
    protected $categoryService;
    protected $subProductService;
    protected $checkoutService;

    public function __construct(
        ProductService $productService,
        SubProductService $subProductService,
        CategoryService $categoryService,
        CheckoutService $checkoutService,
    )
    {
        $this->productService = $productService;
        $this->subProductService = $subProductService;
        $this->categoryService = $categoryService;
        $this->checkoutService = $checkoutService;
    }

    public function show(Request $request)
    {
        $categories = $this->categoryService->getWithProductsAndSubProducts();

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

            $store = app('store');

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

            $result = $this->checkoutService->checkout($productId, $subProductId, $customer->_id, (int) $quantity, $store->id, PaymentMethodSeller::KEY['BALANCE']);

            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $result['message'] ?? 'Checkout failed'
                ], 500);
            }

            return response()->json([
                'success' => true,
                'message' => 'Order created and payment processing started',
                'order_number' => $result['order_number'] ?? null,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error processing purchase request: ' . $e->getMessage()
            ], 500);
        }
    }

}
