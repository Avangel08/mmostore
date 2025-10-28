<?php

namespace App\Http\Controllers\Admin\StoreCategory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategory\StoreCategoryRequest;
use App\Models\MySQL\StoreCategory;
use App\Services\StoreCategory\StoreCategoryService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class StoreCategoryController extends Controller
{
    protected $storeCategoryService;

    public function __construct(StoreCategoryService $storeCategoryService)
    {
        $this->storeCategoryService = $storeCategoryService;
    }

    public function index(Request $request)
    {
        return Inertia::render('StoreCategory/index', [
            'statusConst' => fn() => [
                StoreCategory::STATUS['ACTIVE'] => 'Active',
                StoreCategory::STATUS['INACTIVE'] => 'Inactive',
            ],
            'storeCategories' => fn() => $this->storeCategoryService->getPaginateData($request),
            'detailStoreCategory' => fn() => $this->storeCategoryService->findById(id: $request->input('id')),
        ]);
    }

    public function store(StoreCategoryRequest $request)
    {
        // if (auth(config('guard.admin'))->user()->cannot('store-category_create')) {
        //     return abort(403);
        // }
        try {
            $data = $request->validated();
            $this->storeCategoryService->createStoreCategory($data);
            return back()->with('success', 'Store category created successfully');
        } catch (ValidationException $ve) {
            throw $ve;
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.admin'))->id() ?? null]);
            return back()->with('error', $e->getMessage());
        }
    }

    public function update($id, StoreCategoryRequest $request)
    {
        // if (auth(config('guard.admin'))->user()->cannot('store-category_update')) {
        //     return abort(403);
        // }
        try {
            $storeCategory = $this->storeCategoryService->findById($id);

            if (!$storeCategory) {
                return back()->with('error', 'Store category not found');
            }
            $data = $request->validated();
            $this->storeCategoryService->updateStoreCategory($storeCategory, $data);

            return back()->with('success', 'Store category updated successfully');
        } catch (ValidationException $ve) {
            throw $ve;
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.admin'))->id() ?? null]);
            return back()->with('error', $e->getMessage());
        }
    }


    public function destroy($id)
    {
        // if (auth(config('guard.admin'))->user()->cannot('store-category_delete')) {
        //     return abort(403);
        // }
        try {
            $storeCategory = $this->storeCategoryService->findById($id);
            if (!$storeCategory) {
                return back()->with('error', 'Store category not found');
            }

            $this->storeCategoryService->delete($storeCategory);

            return back()->with('success', 'Store category deleted successfully');
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => request()->ip(), 'user_id' => auth(config('guard.admin'))->id() ?? null]);
            return back()->with('error', $e->getMessage());
        }
    }

    public function deleteMultipleStoreCategories(Request $request)
    {
        // if (auth(config('guard.admin'))->user()->cannot('store-category_delete')) {
        //     return abort(403);
        // }
        try {   
            $ids = $request->input('ids', []);
            $storeCategories = $this->storeCategoryService->findByIds($ids);

            if ($storeCategories->count() !== count($ids)) {
                return back()->with('error', 'Some store categories not found');
            }

            $this->storeCategoryService->deleteMultiple($ids);

            return back()->with('success', 'Store categories deleted successfully');
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => request()->ip(), 'user_id' => auth(config('guard.admin'))->id() ?? null]);
            return back()->with('error', $e->getMessage());
        }
    }
}
