<?php

namespace App\Services\Seller\Category;

use App\Models\Mongo\Categories;

class CategoryService
{
    public function getAllCategory($select = ['*'], $relation = [], $isPaginate = false, $perPage = 10, $page = 1, $orderBy = ['id', 'DESC'])
    {
        $query = Categories::select($select)->with($relation);

        if ($isPaginate) {
            return $query->orderBy(...$orderBy)->paginate($perPage, ['*'], 'page', $page);
        }

        return $query->orderBy(...$orderBy)->get();
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
}
