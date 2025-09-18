<?php

namespace App\Services\Seller\Category;

use App\Models\Mongo\Categories;

class CategoryService
{
    public function getForTable($request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        return Categories::filterName($request)
            ->filterStatus($request)
            ->filterCreatedDate($request)
            ->orderBy('_id', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function getById($id, $select = ['*'], $relation = [])
    {
        return Categories::select($select)->with($relation)->where('_id', $id)->first();
    }

    public function createCategory(array $data)
    {
        return Categories::create([
            'name' => $data['categoryName'],
            'status' => $data['categoryStatus'],
        ]);
    }

    public function updateCategory(Categories $category, array $data)
    {
        return $category->update([
            'name' => $data['categoryName'],
            'status' => $data['categoryStatus'],
        ]);
    }

    public function findByIds(array $ids, $select = ['*'], $relation = [])
    {
        return Categories::select($select)->with($relation)->whereIn('_id', $ids)->get();
    }

    public function delete(Categories $category)
    {
        return $category->delete();
    }

    public function deleteMultiple(array $ids)
    {
        return Categories::whereIn('_id', $ids)->delete();
    }
}
