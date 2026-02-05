<?php

namespace App\Services\Product;

use App\Models\Mongo\ImportAccountHistory;

class ImportAccountHistoryService
{
    public function getForTable($subProductId, $request)
    {
        $page = $request->input('importPage', 1);
        $perPage = $request->input('importPerPage', 10);

        return ImportAccountHistory::where('sub_product_id', $subProductId)
            ->orderBy('_id', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function getById($id, $select = ['*'], $relation = [])
    {
        return ImportAccountHistory::select($select)->with($relation)->where('_id', $id)->first();
    }

    public function create(array $data)
    {
        return ImportAccountHistory::create($data);
    }
}
