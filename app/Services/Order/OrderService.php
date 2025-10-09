<?php

namespace App\Services\Order;

use App\Models\Mongo\Orders;
use DB;


class OrderService
{
    public function findById($id)
    {
        return Orders::where('_id', $id)->first();
    }

    public function create($data)
    {
        return Orders::create($data);
    }

    public function update($item, $data)
    {
        return $item->update($data);
    }

    public function delete($id)
    {
        return Orders::where('_id', $id)->delete();
    }

    public function getForTable(array $request)
    {
        $page = $request['page'] ?? 1;
        $perPage = $request['perPage'] ?? 10;

        $query = Orders::query();

        if (isset($request['search']) && $request['search'] != '') {
            $search = $request['search'];
            $query->where(function($q) use ($search) {
                $q->where('order_number', 'like', '%' . $search . '%')
                  ->orWhere('notes', 'like', '%' . $search . '%');
            });
        }

        if (isset($request['status']) && $request['status'] != '') {
            $query->where('status', $request['status']);
        }

        if (isset($request['payment_status']) && $request['payment_status'] != '') {
            $query->where('payment_status', $request['payment_status']);
        }

        if (isset($request['date_from']) && $request['date_from'] != '') {
            $query->where('created_at', '>=', $request['date_from']);
        }

        if (isset($request['date_to']) && $request['date_to'] != '') {
            $query->where('created_at', '<=', $request['date_to']);
        }

        if (isset($request['category_id']) && $request['category_id'] != '') {
            $query->where('category_id', $request['category_id']);
        }

        if (isset($request['product_id']) && $request['product_id'] != '') {
            $query->where('product_id', $request['product_id']);
        }

        return $query->with([
                'category:_id,name',
                'product:_id,name',
                'subProduct:_id,name,description',
                'customer:_id,name,email'
            ])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function getByCustomerId($customerId, array $request = [])
    {
        $page = $request['page'] ?? 1;
        $perPage = $request['perPage'] ?? 10;

        $query = Orders::where('customer_id', $customerId);

        if (isset($request['search']) && $request['search'] != '') {
            $search = $request['search'];
            $query->where(function($q) use ($search) {
                $q->where('order_number', 'like', '%' . $search . '%')
                  ->orWhere('notes', 'like', '%' . $search . '%');
            });
        }

        return $query->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function getByOrderCode($orderCode)
    {
        return Orders::where('order_number', $orderCode)->first();
    }
}