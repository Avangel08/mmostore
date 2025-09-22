<?php

namespace App\Http\Controllers\Seller\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\Product\SubProductRequest;
use App\Services\Product\ProductService;
use App\Services\Product\SubProductService;

class SubProductController extends Controller
{
    protected $subProductService;

    protected $productService;

    public function __construct(SubProductService $subProductService, ProductService $productService)
    {
        $this->subProductService = $subProductService;
        $this->productService = $productService;
    }

    public function store(SubProductRequest $request)
    {
        // if (auth(config('guard.seller'))->user()->cannot('subproduct_create')) {
        //     return abort(403);
        // }

        try {
            $data = $request->validated();
            $this->subProductService->createSubProduct($data);

            return back()->with('success', 'Sub product created successfully');
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.seller'))->id() ?? null]);

            return back()->with('error', $e->getMessage());
        }
    }

    public function update($sub, $id, SubProductRequest $request)
    {
        // if (auth(config('guard.seller'))->user()->cannot('subproduct_edit')) {
        //     return abort(403);
        // }

        try {
            $subProduct = $this->subProductService->getById($id);

            if (! $subProduct) {
                return back()->with('error', 'Sub product not found');
            }

            $data = $request->validated();
            $this->subProductService->updateSubProduct($subProduct, $data);

            return back()->with('success', 'Sub product updated successfully');
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.seller'))->id() ?? null]);

            return back()->with('error', $e->getMessage());
        }
    }

    public function destroy($sub, $id)
    {
        // if (auth(config('guard.seller'))->user()->cannot('subproduct_delete')) {
        //     return abort(403);
        // }

        try {
            $subProduct = $this->subProductService->getById($id);
            if (! $subProduct) {
                return back()->with('error', 'Sub product not found');
            }

            $this->subProductService->delete($subProduct);

            return back()->with('success', 'Sub product deleted successfully');
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => request()->ip(), 'user_id' => auth(config('guard.seller'))->id() ?? null]);

            return back()->with('error', $e->getMessage());
        }
    }
}
