<?php

namespace App\Services\Product;

use App\Models\Mongo\SubProducts;

/**
 * Class SubProductService
 */
class SubProductService
{
    public function getById($id, $select = ['*'], $relation = [])
    {
        return SubProducts::select($select)->with($relation)->where('_id', $id)->first();
    }

    public function getFromProductIdForTable($request)
    {
        $page = $request->input('subProductPage', 1);
        $perPage = $request->input('subProductPerPage', 10);
        $productId = $request->input('product_id');

        return SubProducts::where('product_id', $productId)
            ->with('product:_id,name')
            ->orderBy('_id', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function createSubProduct(array $data)
    {
        $productData = [
            'product_id' => $data['productId'],
            'name' => $data['subProductName'],
            'status' => SubProducts::STATUS['ACTIVE'],
            'price' => (double) $data['price'],
            'quantity' => (int) 0,
        ];

        return SubProducts::create($productData);
    }

    public function updateSubProduct(SubProducts $subProduct, array $data)
    {
        $dataToUpdate = [
            'name' => $data['subProductName'],
            'price' => (double) $data['price'],
            'status' => $data['status'],
        ];

        return $subProduct->update($dataToUpdate);
    }

    public function delete(SubProducts $subProduct)
    {
        return $subProduct->delete();
    }

    public function isExistsNameSubProduct($name, $productId, $subProductId = null, bool $ignore = false)
    {
        $query = SubProducts::where('name', $name)->where('product_id', $productId);

        if ($ignore) {
            $query->where('_id', '!=', $subProductId);
        }

        return $query->exists();
    }

    public function updateSubProductQuantity($subProductId, $quantity)
    {
        return SubProducts::where('_id', $subProductId)->update(['quantity' => (int) $quantity]);
    }
}
