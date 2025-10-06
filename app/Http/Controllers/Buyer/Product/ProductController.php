<?php

namespace App\Http\Controllers\Buyer\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Buyer\Product\CheckoutProductRequest;
use App\Models\Mongo\Categories;
use App\Services\Product\ProductService;
use App\Jobs\Systems\JobProcessPurchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{

    protected $productService;
    protected $categoryService;
    protected $subProductService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
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

    public function detail($sub, String $productId)
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
                'price' => 'required|numeric|min:0'
            ]);

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
            $price = $request->input('price');
            $store = $request->input('current_store');

            $orderId = 'ORDER_' . time() . '_' . $customer->_id;

            JobProcessPurchase::dispatchSync(
                $productId,
                $subProductId,
                $customer->_id,
                $quantity,
                $store->user_id,
                $orderId,
                'sub_product'
            );

            return response()->json([
                'success' => true,
                'message' => 'Done',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error processing purchase request 123: ' . $e->getMessage()
            ], 500);
        }
    }
}
