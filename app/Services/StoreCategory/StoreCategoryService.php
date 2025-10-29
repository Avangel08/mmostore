<?php

namespace App\Services\StoreCategory;
use App\Models\MySQL\StoreCategory;
use App\Models\MySQL\Stores;

class StoreCategoryService
{
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
        return StoreCategory::create([
            'name' => $data['store_category_name'],
            'status' => $data['store_category_status'],
            'description' => $data['description'] ?? null,
        ]);
    }

    public function updateStoreCategory(StoreCategory $storeCategory, array $data)
    {
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
        return StoreCategory::where('status', StoreCategory::STATUS['ACTIVE'])
            ->select($select)
            ->with($relation)
            ->orderBy('name', 'asc')
            ->get();
    }
}
