<?php

namespace App\Services\Product;

use App\Models\Mongo\Accounts;
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

    public function getFromProductIdForTable($dataRequest, $select = ['*'], $relation = [])
    {
        $page = $dataRequest['subProductPage'] ?? 1;
        $perPage = $dataRequest['subProductPerPage'] ?? 10;
        $productId = $dataRequest['productId'] ?? null;

        return SubProducts::where('product_id', $productId)
            ->with($relation)
            ->orderBy('_id', 'desc')
            ->paginate($perPage, $select, 'page', $page);
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

    public function setSubProductQuantity($subProductId, $quantity)
    {
        return SubProducts::where('_id', $subProductId)->update(['quantity' => (int) $quantity]);
    }

    public function updateSubProductQuantityWithCount($subProductId)
    {
        $pipeline = [
            [
                '$match' => [
                    'sub_product_id' => $subProductId,
                    'order_id' => null
                ]
            ],
            [
                '$group' => [
                    '_id' => '$sub_product_id',
                    'count' => ['$sum' => 1]
                ]
            ],
            [
                '$merge' => [
                    'into' => 'sub_products',
                    'on' => '_id',
                    'whenMatched' => [
                        ['$set' => ['quantity' => '$count']]
                    ],
                    'whenNotMatched' => [
                        ['$set' => ['quantity' => (int) 0]]
                    ]
                ]
            ]
        ];

        try {
            return Accounts::raw()->aggregate($pipeline)->toArray();
        } catch (\Exception $e) {
            $totalProduct = Accounts::where('sub_product_id', $subProductId)
                ->whereNull('order_id')
                ->count();
            return $this->setSubProductQuantity($subProductId, $totalProduct);
        }
    }
}
