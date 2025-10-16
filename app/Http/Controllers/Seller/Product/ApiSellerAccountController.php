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
use Log;
use Throwable;

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

    public function store(ApiAccountRequest $request)
    {
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
        } catch (Throwable $e) {
            Log::error($e, ['ip' => $request->ip(), 'user_id' => auth()->id() ?? null]);
            return $this->error($e->getMessage());
        }
    }

    public function destroy(ApiAccountRequest $request)
    {
        try {
            $dataRequest = $request->validated();
            $subProduct = $this->subProductService->getById($dataRequest['sub_product_id'], ['id', 'name']);

            if (!$subProduct) {
                throw new Exception('Sub product not found');
            }

            $message = "Deleted unsold accounts from subProduct {$subProduct?->name} ({$dataRequest['sub_product_id']}) successfully";
            $dataResponse = null;

            if (empty($dataRequest['accounts'])) {
                $this->sellerAccountService->startDeleteAllUnsoldAccount($dataRequest['sub_product_id']);
                $message .= ". Unsold accounts will be deleted after a few minutes";
            } else {
                $dataResponse = $this->sellerAccountService->deleteListAccount($dataRequest['sub_product_id'], $dataRequest['accounts']);
            }

            return $this->success($message, $dataResponse ? ['data' => $dataResponse] : []);
        } catch (Throwable $e) {
            Log::error($e, ['ip' => $request->ip(), 'user_id' => auth()->id() ?? null]);
            return $this->error($e->getMessage());
        }
    }
}
