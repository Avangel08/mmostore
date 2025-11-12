<?php

namespace App\Services\StoreCategory;
use App\Models\MySQL\StoreCategory;
use App\Models\MySQL\Stores;
use Cache;

class StoreCategoryService
{
    private $cacheTimeout = 120; //second
    public function getPaginateData($request)
    {
        $page = $request['page'] ?? 1;
        $perPage = $request['perPage'] ?? 10;

        return StoreCategory::filterName($request)
            ->filterStatus($request)
            ->filterCreatedDate($request)
            ->orderBy('id', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function findById($id, $select = ['*'], $relation = [])
    {
        return StoreCategory::with($relation)->select($select)->find($id);
    }

    public function findByStatus($status, $select = ['*'], $relation = [])
    {
        return StoreCategory::with($relation)->select($select)->where('status', $status)->get();
    }

    public function createStoreCategory(array $data)
    {
        $this->flushCache();
        return StoreCategory::create([
            'name' => $data['store_category_name'],
            'status' => $data['store_category_status'],
            'description' => $data['description'] ?? null,
        ]);
    }

    public function updateStoreCategory(StoreCategory $storeCategory, array $data)
    {
        $this->flushCache();
        return $storeCategory->update([
            'name' => $data['store_category_name'],
            'status' => $data['store_category_status'],
            'description' => $data['description'] ?? null,
        ]);
    }

    public function findByIds(array $ids, $select = ['*'], $relation = [])
    {
        return StoreCategory::select($select)->with($relation)->whereIn('id', $ids)->get();
    }

    public function delete(StoreCategory $storeCategory)
    {
        $stores = $storeCategory->stores()->get();
        $storeCategory->stores()->detach();

        Stores::whereDoesntHave('storeCategories')
            ->whereIn('id', $stores->pluck('id'))
            ->update(['verified_at' => null]);

        $this->flushCache();
        return $storeCategory->delete();
    }

    public function deleteMultiple(array $ids)
    {
        $categories = StoreCategory::whereIn('id', $ids)->get();

        $stores = collect();
        foreach ($categories as $category) {
            $stores = $stores->merge($category->stores()->get());
            $category->stores()->detach();
        }

        Stores::whereIn('id', $stores->pluck('id')->unique())
            ->whereDoesntHave('storeCategories')
            ->update(['verified_at' => null]);

        $this->flushCache();
        return StoreCategory::whereIn('id', $ids)->delete();
    }

    public function getCategoryOptions()
    {
        return StoreCategory::where('status', StoreCategory::STATUS['ACTIVE'])
            ->orderBy('name', 'asc')
            ->get()
            ->map(function ($storeCategory) {
                return [
                    'value' => $storeCategory->id,
                    'label' => $storeCategory->name,
                ];
            })
            ->toArray();
    }

    public function getAllCategories($select = ['*'], $relation = [])
    {
        $cacheKey = "all_category_" . md5(json_encode([$select, $relation]));

        return Cache::tags([$this->getCacheTag()])->remember($cacheKey, $this->cacheTimeout, function () use ($select, $relation) {
            return StoreCategory::where('status', StoreCategory::STATUS['ACTIVE'])
                ->select($select)
                ->with($relation)
                ->orderBy('name', 'asc')
                ->get()
                ->map(function ($item) {
                    $item->name = strip_tags($item->name);
                    return $item;
                });
        });
    }

    public function getCacheTag()
    {
        return 'store_categories';
    }

    public function flushCache()
    {
        Cache::tags([$this->getCacheTag()])->flush();
    }
}
