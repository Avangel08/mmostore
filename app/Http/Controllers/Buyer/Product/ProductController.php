<?php

namespace App\Http\Controllers\Buyer\Product;

use App\Http\Controllers\Controller;
use App\Models\Mongo\Categories;
use App\Services\Product\ProductService;
use Illuminate\Http\Request;

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


}
