<?php

namespace App\Http\Controllers\Api\Public\ResourceMmo;

use App\Helpers\Helpers;
use App\Http\Controllers\Controller;
use App\Http\Resources\Public\Store\StoreResource;
use App\Services\Home\StoreService;
use App\Services\StoreCategory\StoreCategoryService;
use App\Traits\ApiResourceResponse;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Log;
use Throwable;

class ResourceMmoApiController extends Controller
{
    use ApiResourceResponse;
    protected $storeCategoryService;
    protected $storeService;

    public function __construct(StoreCategoryService $storeCategoryService, StoreService $storeService)
    {
        $this->storeCategoryService = $storeCategoryService;
        $this->storeService = $storeService;
    }

    public function getStoreCategories(Request $request)
    {
        try {
            $responseData = [
                'data' => $this->storeCategoryService->getAllCategories(['id', 'name']),
            ];
            return $this->success('Store Categories Retrieved Successfully', $responseData);
        } catch (Throwable $e) {
            Log::error($e, ['ip' => $request->ip()]);
            return $this->error('Please try again later');
        }
    }

    public function getStores(Request $request)
    {
        try {
            $dataRequest = Helpers::transformArrayKeys($request->all(), 'camel');
            $responseData = StoreResource::collection($this->storeService->getStoresVerified($dataRequest, ['id', 'name', 'user_id', 'domain', 'database_config'], ['user:id,name', 'storeCategories:id,name']));
            return $this->success('Stores Retrieved Successfully', $responseData);
        } catch (Throwable $e) {
            Log::error($e, ['ip' => $request->ip()]);
            return $this->error('Please try again later');
        }
    }

    public function getBanner(Request $request)
    {
        try {
            $pathBanner = asset('images/banner/Banner_web-vi.png');
            return $this->success('Banner Retrieved Successfully', [
                'data' => [
                    'image_url' => $pathBanner,
                    'alt_text' => 'Banner Image',
                    'href' => route('home.index'),
                ]
            ]);
        } catch (Throwable $e) {
            Log::error($e, ['ip' => $request->ip()]);
            return $this->error('Please try again later');
        }
    }
}
