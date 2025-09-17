<?php

namespace App\Http\Controllers\Seller\Category;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\Category\CategoryRequest;
use App\Models\Mongo\Categories;
use App\Services\Seller\Category\CategoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    protected $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function index(Request $request)
    {
        // if (auth(config('guard.seller'))->user()->cannot('category_view')) {
        //     return abort(403);
        // }
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        return Inertia::render('Category/index', [
            'statusConst' => fn () => [
                Categories::STATUS['ACTIVE'] => 'Active',
                Categories::STATUS['INACTIVE'] => 'Inactive',
            ],
            'categories' => fn () => $this->categoryService->getAllCategory(isPaginate: true, page: $page, perPage: $perPage),
            'detailCategory' => fn () => $this->categoryService->getById(id: $request->input('id')),
        ]);
    }

    public function createCategory(CategoryRequest $request)
    {
        // if (auth(config('guard.seller'))->user()->cannot('category_create')) {
        //     return abort(403);
        // }
        try {
            $data = $request->validated();
            $this->categoryService->createCategory($data);

            return redirect()->route('seller.category')->with('success', 'Category created successfully.');
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.admin'))->id() ?? null]);

            return back()->with('error', $e->getMessage());
        }
    }

    public function updateCategory($sub, $id, CategoryRequest $request)
    {
        // if (auth(config('guard.seller'))->user()->cannot('category_create')) {
        //     return abort(403);
        // }
        try {
            $category = $this->categoryService->getById($id);

            if (!$category) {
                return back()->with('error', 'Category not found');
            }

            $data = $request->validated();
            $this->categoryService->updateCategory($category, $data);

            return redirect()->route('seller.category')->with('success', 'Category updated successfully.');
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.admin'))->id() ?? null]);

            return back()->with('error', $e->getMessage());
        }
    }
}
