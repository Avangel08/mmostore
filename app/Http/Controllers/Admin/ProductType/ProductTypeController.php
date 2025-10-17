<?php

namespace App\Http\Controllers\Admin\ProductType;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductType\ProductTypeRequest;
use App\Models\MySQL\ProductType;
use App\Services\ProductType\ProductTypeService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ProductTypeController extends Controller
{
    protected $productTypeService;

    public function __construct(ProductTypeService $productTypeService)
    {
        $this->productTypeService = $productTypeService;
    }

    public function index(Request $request)
    {
        return Inertia::render('ProductType/index', [
            'statusConst' => fn() => [
                ProductType::STATUS['ACTIVE'] => 'Active',
                ProductType::STATUS['INACTIVE'] => 'Inactive',
            ],
            'productTypes' => fn() => $this->productTypeService->getPaginateData($request),
            'detailProductType' => fn() => $this->productTypeService->findById(id: $request->input('id')),
        ]);
    }

    public function store(ProductTypeRequest $request)
    {
        // if (auth(config('guard.admin'))->user()->cannot('product-type_create')) {
        //     return abort(403);
        // }
        try {
            $data = $request->validated();
            $this->productTypeService->createProductType($data);
            return back()->with('success', 'Product type created successfully');
        } catch (ValidationException $ve) {
            throw $ve;
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.admin'))->id() ?? null]);
            return back()->with('error', $e->getMessage());
        }
    }

    public function update($id, ProductTypeRequest $request)
    {
        // if (auth(config('guard.admin'))->user()->cannot('product-type_update')) {
        //     return abort(403);
        // }
        try {
            $productType = $this->productTypeService->findById($id);

            if (!$productType) {
                return back()->with('error', 'Product type not found');
            }

            $data = $request->validated();

            // $existNameProductType = $this->productTypeService->findByNameIgnoreCase($data['productTypeName']);
            // if ($existNameProductType && $existNameProductType?->id != (string) $productType?->id) {
            //     throw ValidationException::withMessages(['productTypeName' => 'The product type name has already been taken.']);
            // }

            $this->productTypeService->updateProductType($productType, $data);

            return back()->with('success', 'Product type updated successfully');
        } catch (ValidationException $ve) {
            throw $ve;
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.admin'))->id() ?? null]);

            return back()->with('error', $e->getMessage());
        }
    }


    public function destroy($id)
    {
        // if (auth(config('guard.admin'))->user()->cannot('product-type_delete')) {
        //     return abort(403);
        // }
        try {
            $productType = $this->productTypeService->findById($id);
            if (!$productType) {
                return back()->with('error', 'Product type not found');
            }

            $this->productTypeService->delete($productType);

            return back()->with('success', 'Product type deleted successfully');
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => request()->ip(), 'user_id' => auth(config('guard.admin'))->id() ?? null]);

            return back()->with('error', $e->getMessage());
        }
    }

    public function deleteMultipleProductTypes(Request $request)
    {
        // if (auth(config('guard.admin'))->user()->cannot('product-type_delete')) {
        //     return abort(403);
        // }
        try {
            $ids = $request->input('ids', []);
            $productTypes = $this->productTypeService->findByIds($ids);

            if ($productTypes->count() !== count($ids)) {
                return back()->with('error', 'Some product types not found');
            }

            $this->productTypeService->deleteMultiple($ids);

            return back()->with('success', 'Product types deleted successfully');
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => request()->ip(), 'user_id' => auth(config('guard.admin'))->id() ?? null]);

            return back()->with('error', $e->getMessage());
        }
    }
}
