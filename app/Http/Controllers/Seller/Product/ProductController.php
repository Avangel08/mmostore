<?php

namespace App\Http\Controllers\Seller\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\Product\ProductRequest;
use App\Models\Mongo\Categories;
use App\Models\Mongo\Products;
use App\Services\Category\CategoryService;
use App\Services\Product\ProductService;
use App\Services\Product\SubProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    protected $productService;
    protected $categoryService;
    protected $subProductService;

    public function __construct(ProductService $productService, CategoryService $categoryService, SubProductService $subProductService)
    {
        $this->productService = $productService;
        $this->categoryService = $categoryService;
        $this->subProductService = $subProductService;
    }

    public function index(ProductRequest $request)
    {
        // if (auth(config('guard.seller'))->user()->cannot('category_view')) {
        //     return abort(403);
        // }

        return Inertia::render('Product/index', [
            'categories' => Inertia::optional(fn() => $this->categoryService->getAll(['_id', 'name'])),
            'statusConst' => fn() => [
                Products::STATUS['ACTIVE'] => 'Active',
                Products::STATUS['INACTIVE'] => 'Inactive',
            ],
            'products' => fn() => $this->productService->getForTable($request),
            'subProduct' => fn() => $this->subProductService->getFromProductIdForTable($request),
        ]);
    }

    public function create()
    {
        // if (auth(config('guard.seller'))->user()->cannot('category_create')) {
        //     return abort(403);
        // }

        return Inertia::render('Product/product', [
            'categories' => fn() => $this->categoryService->getAll(['_id', 'name']),
        ]);
    }

    public function edit($sub, string $id)
    {
        // if (auth(config('guard.seller'))->user()->cannot('category_view')) {
        //     return abort(403);
        // }

        $product = $this->productService->getById($id);
        if (! $product) {
            abort(404);
        }

        return Inertia::render('Product/product', [
            'product' => fn() => $product,
            'categories' => fn() => $this->categoryService->getAll(['_id', 'name']),
        ]);
    }

    public function store(ProductRequest $request)
    {
        // if (auth(config('guard.seller'))->user()->cannot('category_create')) {
        //     return abort(403);
        // }
        try {
            $data = $request->validated();
            $this->productService->createProduct($data);

            return back()->with('success', 'Product created successfully');
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.seller'))->id() ?? null]);

            return back()->with('error', $e->getMessage());
        }
    }

    public function update($sub, $id, ProductRequest $request)
    {
        // if (auth(config('guard.seller'))->user()->cannot('category_create')) {
        //     return abort(403);
        // }
        try {
            $product = $this->productService->getById($id);

            if (! $product) {
                return back()->with('error', 'Product not found');
            }

            $data = $request->validated();
            $this->productService->updateProduct($product, $data);

            return back()->with('success', 'Product updated successfully');
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.seller'))->id() ?? null]);

            return back()->with('error', $e->getMessage());
        }
    }

    public function destroy($sub, $id)
    {
        // if (auth(config('guard.seller'))->user()->cannot('category_delete')) {
        //     return abort(403);
        // }
        try {
            $product = $this->productService->getById($id);
            if (! $product) {
                return back()->with('error', 'Product not found');
            }

            $this->productService->delete($product);

            return back()->with('success', 'Product deleted successfully');
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => request()->ip(), 'user_id' => auth(config('guard.seller'))->id() ?? null]);

            return back()->with('error', $e->getMessage());
        }
    }

    public function deleteMultipleProduct(Request $request)
    {
        // if (auth(config('guard.seller'))->user()->cannot('category_delete')) {
        //     return abort(403);
        // }
        try {
            $ids = $request->input('ids', []);
            $products = $this->productService->findByIds($ids);

            if ($products->count() !== count($ids)) {
                return back()->with('error', 'Some products not found');
            }

            $this->productService->deleteMultiple($ids);

            return back()->with('success', 'Products deleted successfully');
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => request()->ip(), 'user_id' => auth(config('guard.seller'))->id() ?? null]);

            return back()->with('error', $e->getMessage());
        }
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
                    ['key' => 'action', 'name' => 'Action']
                ],
                'products' => $category->products->map(function ($product) {
                    return [
                        'id' => $product->_id,
                        'title' => $product->name,
                        'short_description' => $product->short_description,
                        'price' => $product->subProducts->min('price') ?? 0,
                        'quantity' => $product->subProducts->min('total_product') ?? 0,
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
