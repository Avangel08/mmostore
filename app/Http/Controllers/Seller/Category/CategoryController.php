<?php

namespace App\Http\Controllers\Seller\Category;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\Category\CategoryRequest;
use App\Models\Mongo\Categories;
use App\Services\Category\CategoryService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
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
            'statusConst' => fn() => [
                Categories::STATUS['ACTIVE'] => 'Active',
                Categories::STATUS['INACTIVE'] => 'Inactive',
            ],
            'categories' => fn() => $this->categoryService->getForTable($request),
            'detailCategory' => fn() => $this->categoryService->getById(id: $request->input('id')),
        ]);
    }

    public function store(CategoryRequest $request)
    {
        // if (auth(config('guard.seller'))->user()->cannot('category_create')) {
        //     return abort(403);
        // }
        try {
            $data = $request->validated();

            $existNameCategory = $this->categoryService->findByNameIgnoreCase($data['categoryName']);
            if ($existNameCategory) {
                throw ValidationException::withMessages(['categoryName' => 'The category name has already been taken.']);
            }

            $this->categoryService->createCategory($data);

            return back()->with('success', 'Category created successfully');
        } catch (ValidationException $ve) {
            throw $ve;
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.seller'))->id() ?? null]);

            return back()->with('error', $e->getMessage());
        }
    }

    public function update($sub, $id, CategoryRequest $request)
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

            $existNameCategory = $this->categoryService->findByNameIgnoreCase($data['categoryName']);
            if ($existNameCategory && $existNameCategory?->id != (string) $category?->id) {
                throw ValidationException::withMessages(['categoryName' => 'The category name has already been taken.']);
            }

            $this->categoryService->updateCategory($category, $data);

            return back()->with('success', 'Category updated successfully');
        } catch (ValidationException $ve) {
            throw $ve;
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
            $category = $this->categoryService->getById($id);
            if (!$category) {
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
