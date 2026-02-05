<?php

namespace App\Services\ProductType;

use App\Models\MySQL\ProductType;

/**
 * Class ProductTypeService
 * @package App\Services
 */
class ProductTypeService
{
    public function getPaginateData($request)
    {
        $page = $request['page'] ?? 1;
        $perPage = $request['perPage'] ?? 10;

        return ProductType::filterName($request)
            ->filterStatus($request)
            ->filterCreatedDate($request)
            ->orderBy('id', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function findById($id, $select = ['*'], $relation = [])
    {
        return ProductType::with($relation)->select($select)->find($id);
    }

    public function findByStatus($status, $select = ['*'], $relation = [])
    {
        return ProductType::with($relation)->select($select)->where('status', $status)->get();
    }

    public function createProductType(array $data)
    {
        return ProductType::create([
            'name' => $data['productTypeName'],
            'status' => $data['productTypeStatus'],
            'description' => $data['description'] ?? null,
        ]);
    }

    public function updateProductType(ProductType $productType, array $data)
    {
        return $productType->update([
            'name' => $data['productTypeName'],
            'status' => $data['productTypeStatus'],
            'description' => $data['description'] ?? null,
        ]);
    }

    public function findByIds(array $ids, $select = ['*'], $relation = [])
    {
        return ProductType::select($select)->with($relation)->whereIn('id', $ids)->get();
    }

    public function delete(ProductType $productType)
    {
        return $productType->delete();
    }

    public function deleteMultiple(array $ids)
    {
        return ProductType::whereIn('id', $ids)->delete();
    }
}
