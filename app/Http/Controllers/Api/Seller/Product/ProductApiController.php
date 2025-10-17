<?php

namespace App\Http\Controllers\Api\Seller\Product;

use App\Helpers\Helpers;
use App\Http\Controllers\Controller;
use App\Http\Resources\Seller\Product\ProductResource;
use App\Http\Resources\Seller\Product\SubProductResource;
use App\Services\Product\ProductService;
use App\Services\Product\SubProductService;
use App\Traits\ApiResourceResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Log;
use Throwable;

class ProductApiController extends Controller
{
    use ApiResourceResponse;

    protected $productService;

    protected $subProductService;

    public function __construct(ProductService $productService, SubProductService $subProductService)
    {
        $this->productService = $productService;
        $this->subProductService = $subProductService;
    }
    public function index(Request $request)
    {
        try {
            $dataRequest = Helpers::transformArrayKeys($request->all(), 'camel');
            $responseData = ProductResource::collection($this->productService->getForTable($dataRequest, ['*'], ['category:_id,name', 'productType:id,name']));
            return $this->success('Products fetched successfully', $responseData);
        } catch (Throwable $e) {
            Log::error($e, ['ip' => $request->ip(), 'user_id' => auth()->id() ?? null]);
            return $this->error($e->getMessage());
        }
    }

    public function store(Request $request)
    {
        //
    }

    public function show(Request $request, string $id)
    {
        try {
            $dataRequest = Helpers::transformArrayKeys($request->all(), 'camel');
            $dataRequest['productId'] = $id;
            $responseData = SubProductResource::collection($this->subProductService->getFromProductIdForTable($dataRequest, ['*'], ['product:_id,name']));
            return $this->success('SubProducts fetched successfully', $responseData);
        } catch (Throwable $e) {
            Log::error($e, ['ip' => $request->ip(), 'user_id' => auth()->id() ?? null]);
            return $this->error($e->getMessage());
        }
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}
