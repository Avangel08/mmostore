<?php

namespace App\Services\Product;

use App\Helpers\Helpers;
use App\Models\Mongo\Products;
use Illuminate\Support\Facades\Storage;

class ProductService
{
    public function getForTable($dataRequest, $select = ['*'], $relation = [])
    {
        $page = $dataRequest['page'] ?? 1;
        $perPage = $dataRequest['perPage'] ?? 10;

        return Products::filterName($dataRequest)
            ->filterCategory($dataRequest)
            ->filterStatus($dataRequest)
            ->filterCreatedDate($dataRequest)
            ->orderBy('_id', 'desc')
            ->with($relation)
            ->paginate($perPage, $select, 'page', $page);
    }

    public function getById($id, $select = ['*'], $relation = [])
    {
        return Products::select($select)->with($relation)->where('_id', $id)->first();
    }

    public function generateProductSlug($productName)
    {
        $slug = \Str::slug($productName);
        $count = Products::where('slug', 'LIKE', "%{$slug}%")->count();

        return $count ? "{$slug}-" . ($count + 1) : $slug;
    }

    public function createProduct(array $data)
    {
        $productData = [
            'name' => (string) $data['productName'],
            'category_id' => (string) $data['categoryId'],
            'status' => (string) $data['status'],
            'short_description' => (string) $data['shortDescription'],
            'detail_description' => (string) $data['detailDescription'],
            'slug' => (string) $this->generateProductSlug($data['productName']),
            'product_type_id' => (int) $data['productTypeId']
        ];

        $product = Products::create($productData);

        if (!empty($data['image'])) {
            $host = request()->getHost();
            $extension = $data['image']->getClientOriginalExtension();
            $fileName = "product_" . $product->_id . '_' . now()->format('Ymd_His') . '_' . uniqid() . '.' . $extension;
            $imagePath = $data['image']->storeAs("{$host}/products", $fileName, 'public');
            $product->update(['image' => $imagePath]);
        }

        return $product;
    }

    public function updateProduct(Products $product, array $data)
    {
        $dataToUpdate = [
            'name' => (string) $data['productName'],
            'category_id' => (string) $data['categoryId'],
            'status' => (string) $data['status'],
            'short_description' => (string) $data['shortDescription'],
            'detail_description' => (string) $data['detailDescription'],
            'product_type_id' => (int) $data['productTypeId']
        ];

        if ($product['name'] != $data['productName']) {
            $dataToUpdate['slug'] = (string) $this->generateProductSlug($data['productName']);
        }

        if (!empty($data['image'])) {
            if ($product?->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }
            $host = request()->getHost();
            $extension = $data['image']->getClientOriginalExtension();
            $fileName = "product_" . $product->_id . '_' . now()->format('Ymd_His') . '_' . uniqid() . '.' . $extension;
            $imagePath = $data['image']->storeAs("{$host}/products", $fileName, 'public');
            $dataToUpdate['image'] = $imagePath;
        }

        return $product->update($dataToUpdate);
    }

    public function findByIds(array $ids, $select = ['*'], $relation = [])
    {
        return Products::select($select)->with($relation)->whereIn('_id', $ids)->get();
    }

    public function findBySlug(string $slug, $select = ['*'], $relation = [])
    {
        return Products::select($select)->with($relation)->where('slug', $slug)->first();
    }

    public function delete(Products $product)
    {
        return $product->delete();
    }

    public function deleteMultiple(array $ids)
    {
        return Products::whereIn('_id', $ids)->delete();
    }

    public function getActive($select = ['*'], $relation = [])
    {
        return Products::where('status', Products::STATUS['ACTIVE'])->select($select)->with($relation)->get();
    }
}
