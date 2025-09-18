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

        return Inertia::render('Category/index', [
            'statusConst' => fn () => [
                Categories::STATUS['ACTIVE'] => 'Active',
                Categories::STATUS['INACTIVE'] => 'Inactive',
            ],
            'categories' => fn () => $this->categoryService->getForTable($request),
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

            return back()->with('success', 'Category created successfully');
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.seller'))->id() ?? null]);

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

            if (! $category) {
                return back()->with('error', 'Category not found');
            }

            $data = $request->validated();
            $this->categoryService->updateCategory($category, $data);

            return back()->with('success', 'Category updated successfully');
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.seller'))->id() ?? null]);

            return back()->with('error', $e->getMessage());
        }
    }

    
    public function deleteCategory($sub, $id)
    {
        // if (auth(config('guard.seller'))->user()->cannot('category_delete')) {
        //     return abort(403);
        // }
        try {
            $category = $this->categoryService->getById($id);
            if (! $category) {
                return back()->with('error', 'Category not found');
            }

            $this->categoryService->delete($category);

            return back()->with('success', 'Category deleted successfully');
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => request()->ip(), 'user_id' => auth(config('guard.seller'))->id() ?? null]);

            return back()->with('error', $e->getMessage());
        }
    }

    public function deleteMultipleCategories(Request $request)
    {
        // if (auth(config('guard.seller'))->user()->cannot('category_delete')) {
        //     return abort(403);
        // }
        try {
            $ids = $request->input('ids', []);
            $categories = $this->categoryService->findByIds($ids);

            if ($categories->count() !== count($ids)) {
                return back()->with('error', 'Some categories not found');
            }

            $this->categoryService->deleteMultiple($ids);

            return back()->with('success', 'Categories deleted successfully');
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => request()->ip(), 'user_id' => auth(config('guard.seller'))->id() ?? null]);

            return back()->with('error', $e->getMessage());
        }
    }
}
