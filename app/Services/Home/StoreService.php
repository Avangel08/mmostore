<?php
namespace App\Services\Home;

use App\Models\Mongo\Settings;
use App\Models\MySQL\Stores;
use Cache;
use DB;


class StoreService
{
    public function getStoresVerified($request, $select = ['*'], $relation = [])
    {
        $timeout = 60; // second
        $cacheKey = "store:stores_verified:" . md5(json_encode([$request, $select, $relation]));
        return Cache::tags([$this->getCacheTag()])->remember($cacheKey, $timeout, function () use ($request, $select, $relation) {
            $page = $request['page'] ?? 1;
            $perPage = min($request['perPage'] ?? 10, 200);
            
            $storesVerified = Stores::whereNotNull('verified_at')
                ->filterName($request)
                ->filterStoreCategory($request)
                ->select($select)
                ->with($relation)
                ->orderBy('verified_at', 'desc')
                ->paginate($perPage, ['*'], 'page', $page);

            $storesVerified->getCollection()->transform(function ($store) {
                $tenantService = app(\App\Services\Tenancy\TenancyService::class);
                $connection = $tenantService->buildConnectionFromStore($store);
                $tenantService->applyConnection($connection, false);
                $store->data_setting = Settings::pluck('value', 'key');
                return $store;
            });

            return $storesVerified;
        });
    }

    public function create(array $data)
    {
        $this->flushCache();
        return Stores::create($data);
    }

    public function update($item, array $data)
    {
        $this->flushCache();
        return $item->update($data);
    }

    public function delete(Stores $store)
    {
        $store->storeCategories()->detach();
        $this->flushCache();
        return $store->delete();
    }

    public function findById($id, $select = ["*"], $relation = [])
    {
        return Stores::select($select)->with($relation)->where('id', $id)->first();
    }

    public function findByIds($ids, $select = ["*"], $relation = [])
    {
        return Stores::select($select)->with($relation)->whereIn('id', $ids)->get();
    }

    public function findByUserId($userId, $select = ["*"], $relation = [])
    {
        return Stores::select($select)->with($relation)->where('user_id', $userId)->first();
    }

    public function updateByUserId($userId, $data)
    {
        $this->flushCache();
        return Stores::where('user_id', $userId)->update($data);
    }

    public function verifyStore($dataVerifyStore)
    {
        DB::transaction(function () use ($dataVerifyStore) {
            $this->flushCache();
            foreach ($dataVerifyStore as $storeData) {
                $store = Stores::find($storeData['store_id']);
                if ($store) {
                    $storeIds = $storeData['store_category_ids'] ?? [];
                    $store->storeCategories()->sync($storeIds);
                    $verifiedAt = empty($storeIds) ? null : now();
                    $store->update(['verified_at' => $verifiedAt]);
                }
            }
        });
    }

    public function getCacheTag()
    {
        return 'store_verified';
    }

    public function flushCache()
    {
        Cache::tags([$this->getCacheTag()])->flush();
    }
}