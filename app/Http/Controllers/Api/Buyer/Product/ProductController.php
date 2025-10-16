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
        $categories = $this->categoryService->getWithProductsAndSubProducts();

        $result = $categories->map(function ($category) {
            return [
                'id' => $category->_id,
                'name' => $category->name,
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

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    public function show(string $productId)
    {
        $product = $this->productService->getById($productId, ['*'], ['subProducts']);

        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $product]);
    }
}


