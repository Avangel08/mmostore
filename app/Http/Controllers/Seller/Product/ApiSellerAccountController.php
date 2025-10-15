<?php

namespace App\Http\Controllers\Seller\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\Product\ApiAccountRequest;
use App\Services\Product\ImportAccountHistoryService;
use App\Services\Product\SellerAccountService;
use App\Services\Product\SubProductService;
use App\Traits\ApiResourceResponse;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ApiSellerAccountController extends Controller
{
    use ApiResourceResponse;

    protected $sellerAccountService;
    protected $subProductService;
    protected $importAccountHistoryService;
    public function __construct(SellerAccountService $sellerAccountService, SubProductService $subProductService, ImportAccountHistoryService $importAccountHistoryService)
    {
        $this->sellerAccountService = $sellerAccountService;
        $this->subProductService = $subProductService;
        $this->importAccountHistoryService = $importAccountHistoryService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ApiAccountRequest $request)
    {
        // if (auth(config('guard.seller'))->user()->cannot('subproduct_create')) {
        //     return abort(403);
        // }

        try {
            $data = $request->validated();
            $subProduct = $this->subProductService->getById(
                $data['sub_product_id'],
                ['id', 'product_id'],
                [
                    'product:id,name,category_id,product_type_id',
                    'product.productType:id,name',
                    'product.category:id,name'
                ]
            );
            if (!$subProduct) {
                throw new Exception('Sub product not exists');
            }
            if (!$subProduct->product) {
                throw new Exception('Product not exists');
            }
            if (!$subProduct?->product?->productType) {
                throw new Exception('Product type not configured for this product');
            }
            if (!$subProduct?->product?->category) {
                throw new Exception('Category not configured for this product');
            }
            $typeName = $subProduct?->product?->productType?->name ?? "";

            $content = implode(PHP_EOL, $data['accounts']);

            $result = $this->sellerAccountService->processApiAccount($content, $subProduct?->product_id, $subProduct?->id, $typeName) ?? [
                'total_count' => 0,
                'success_count' => 0,
                'error_count' => 0,
                'errors' => [],
            ];

            return $this->success('Uploaded successfully', ['data' => $result], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.seller'))->id() ?? null]);
            return $this->error($e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
