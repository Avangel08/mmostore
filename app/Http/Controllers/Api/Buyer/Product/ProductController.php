<?php

namespace App\Http\Controllers\Api\Buyer\Product;

use App\Http\Controllers\Controller;
use App\Models\Mongo\Orders;
use App\Services\Order\CheckoutService;
use App\Services\Category\CategoryService;
use App\Services\Product\ProductService;
use App\Services\Product\SubProductService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ProductController extends Controller
{
    protected $productService;
    protected $categoryService;
    protected $subProductService;
    protected $checkoutService;

    public function __construct(
        ProductService $productService,
        CategoryService $categoryService,
        SubProductService $subProductService,
        CheckoutService $checkoutService
    ) {
        $this->productService = $productService;
        $this->categoryService = $categoryService;
        $this->subProductService = $subProductService;
        $this->checkoutService = $checkoutService;
    }

    public function index(Request $request)
    {
        $page = $request->get('page', 1);
        $perPage = $request->get('per_page', 10);
        $perPage = min($perPage, 100); // Limit max per page to 100

        $products = $this->productService->getForTable([
            'page' => $page,
            'perPage' => $perPage
        ], ['*'], ['subProducts', 'productType', 'category']);

        $result = $products->map(function ($product) {
            return [
                'id' => $product->_id,
                'name' => $product->name,
                'image_url' => $product->image ? url('storage/' . $product->image) : null,
                'category_name' => $product->category ? $product->category->name : null,
                'product_type_name' => $product->productType ? $product->productType->name : null,
                'status' => $product->status,
                'short_description' => $product->short_description,
                'detail_description' => $product->detail_description,
                'sub_products' => $product->subProducts->map(function ($subProduct) {
                    return [
                        'id' => $subProduct->_id,
                        'name' => $subProduct->name,
                        'price' => $subProduct->price,
                        'quantity' => $subProduct->quantity,
                        'status' => $subProduct->status,
                        'created_at' => $subProduct->created_at ? Carbon::parse($subProduct->created_at)->format('Y-m-d H:i:s') : null,
                        'updated_at' => $subProduct->updated_at ? Carbon::parse($subProduct->updated_at)->format('Y-m-d H:i:s') : null,
                    ];
                }),
                'updated_at' => $product->updated_at ? Carbon::parse($product->updated_at)->format('Y-m-d H:i:s') : null,
                'created_at' => $product->created_at ? Carbon::parse($product->created_at)->format('Y-m-d H:i:s') : null,
            ];
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Products retrieved successfully',
            'data' => [
                'rows' => $result,
                'pagination' => [
                    'current_page' => $products->currentPage(),
                    'per_page' => $products->perPage(),
                    'total' => $products->total(),
                    'last_page' => $products->lastPage(),
                    'from' => $products->firstItem(),
                    'to' => $products->lastItem(),
                ]
            ],
        ], 200);
    }

    public function show(string $productId)
    {
        $product = $this->productService->getById($productId, ['*'], ['subProducts', 'productType', 'category']);

        if (!$product) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found',
                'data' => null,
                'meta' => [
                    'timestamp' => Carbon::now()->format('Y-m-d H:i:s')
                ]
            ], 404);
        }

        $formattedProduct = [
            'id' => $product->_id,
            'name' => $product->name,
            'image_url' => $product->image ? url('storage/' . $product->image) : null,
            'category_name' => $product->category ? $product->category->name : null,
            'product_type_name' => $product->productType ? $product->productType->name : null,
            'status' => $product->status,
            'short_description' => $product->short_description,
            'detail_description' => $product->detail_description,
            'sub_products' => $product->subProducts->map(function ($subProduct) {
                return [
                    'id' => $subProduct->_id,
                    'name' => $subProduct->name,
                    'price' => $subProduct->price,
                    'quantity' => $subProduct->quantity,
                    'status' => $subProduct->status,
                    'created_at' => $subProduct->created_at ? Carbon::parse($subProduct->created_at)->format('Y-m-d H:i:s') : null,
                    'updated_at' => $subProduct->updated_at ? Carbon::parse($subProduct->updated_at)->format('Y-m-d H:i:s') : null,
                ];
            }),
            'updated_at' => $product->updated_at ? Carbon::parse($product->updated_at)->format('Y-m-d H:i:s') : null,
            'created_at' => $product->created_at ? Carbon::parse($product->created_at)->format('Y-m-d H:i:s') : null,
        ];

        return response()->json([
            'status' => 'success',
            'message' => 'Product retrieved successfully',
            'data' => $formattedProduct,
        ], 200);
    }
}


