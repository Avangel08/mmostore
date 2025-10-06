<?php

namespace App\Services\ProductType;

use App\Models\MySQL\ProductType;

/**
 * Class ProductTypeService
 * @package App\Services
 */
class ProductTypeService
{
    public function findById($id, $select = ['*'], $relation = [])
    {
        return ProductType::with($relation)->select($select)->find($id);
    }

    public function findByStatus($status, $select = ['*'], $relation = [])
    {
        return ProductType::with($relation)->select($select)->where('status', $status)->get();
    }
}
