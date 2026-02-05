<?php
namespace App\Services\Home;

use App\Models\Mongo\Settings;
use App\Models\MySQL\Stores;
use Cache;
use DB;
use Http;


class StoreService
{
    public function getStoresVerified($request, $select = ['*'], $relation = [])
    {
        $timeout = 600; // second
        $cacheKey = "store:stores_verified:" . md5(json_encode([$request, $select, $relation]));
        return Cache::tags([$this->getCacheTagVerify()])->remember($cacheKey, $timeout, function () use ($request, $select, $relation) {
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
                $store->domain = $this->getAccessibleDomain($store->domain);
                return $store;
            });

            return $storesVerified;
        });
    }

    public function create(array $data)
    {
        $this->flushCacheVerify();
        return Stores::create($data);
    }

    public function update($item, array $data)
    {
        $this->flushCacheVerify();
        return $item->update($data);
    }

    public function delete(Stores $store)
    {
        $store->storeCategories()->detach();
        $this->flushCacheVerify();
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
        $this->flushCacheVerify();
        return Stores::where('user_id', $userId)->update($data);
    }

    public function verifyStore($dataVerifyStore)
    {
        DB::transaction(function () use ($dataVerifyStore) {
            $this->flushCacheVerify();
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

    public function getCacheTagVerify()
    {
        return 'store_verified';
    }

    public function flushCacheVerify()
    {
        Cache::tags([$this->getCacheTagVerify()])->flush();
    }


    public function getAccessibleDomain(string|array|null $domains, $timeoutSecond = 1, $tryCount = 1): ?string
    {
        if (is_string($domains)) {
            return $domains;
        }

        if (empty($domains)) {
            return null;
        }

        if (count($domains) == 1) {
            return $domains[0];
        }

        $cacheKey = 'store:accessible_domain:' . md5(json_encode([$domains]));
        $timeout = 600; // second

        return Cache::tags([$this->getCacheTagVerify()])->remember($cacheKey, $timeout, function () use ($domains, $timeoutSecond, $tryCount) {
            // loop last to first
            for ($index = count($domains) - 1; $index >= 0; $index--) {
                $domain = $domains[$index];
                if (empty($domain)) {
                    continue;
                }

                if (!str_starts_with($domain, 'http://') && !str_starts_with($domain, 'https://')) {
                    $url = 'https://' . $domain;
                } else {
                    $url = $domain;
                }

                try {
                    $response = Http::retry($tryCount, 100)->timeout($timeoutSecond)->head($url);
                    if ($response->successful()) {
                        return $domain;
                    }
                } catch (\Exception $e) {
                    continue;
                }
            }

            return $domains[0] ?? null;
        });
    }
}