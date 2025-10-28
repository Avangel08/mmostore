<?php
namespace App\Services\Home;

use App\Models\MySQL\Stores;
use DB;


class StoreService
{
    public function create(array $data)
    {
        return Stores::create($data);
    }

    public function update($item, array $data)
    {
        return $item->update($data);
    }

    public function delete(Stores $store)
    {
        $store->storeCategories()->detach();
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
        return Stores::where('user_id', $userId)->update($data);
    }

    public function verifyStore($dataVerifyStore)
    {
        DB::transaction(function () use ($dataVerifyStore) {
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
}