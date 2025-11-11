<?php

namespace App\Services\Order;

use App\Models\Mongo\Orders;
use App\Models\Mongo\SubProducts;
use App\Models\Mongo\Accounts;
use Cache;
use Carbon\Carbon;
use DB;
use Illuminate\Support\Facades\Redis;

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

        $query = Orders::query()
            ->filterSearch($request)
            ->filterStatus($request)
            ->filterPaymentStatus($request)
            ->filterCategory($request)
            ->filterProduct($request)
            ->filterCustomer($request)
            ->filterDate($request);

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

    public function getFormattedOrdersForCustomer($customerId, array $requestData = [])
    {
        $page = $requestData['page'] ?? 1;
        $perPage = $requestData['perPage'] ?? 10;
        $search = $requestData['search'] ?? '';
        $category = $requestData['category'] ?? 'all';
        $from = $requestData['from'] ?? '';
        $to = $requestData['to'] ?? '';

        $query = Orders::where('customer_id', $customerId);

        if ($search !== '') {
            $query->where(function($q) use ($search) {
                $q->where('order_number', 'like', '%' . $search . '%')
                  ->orWhere('notes', 'like', '%' . $search . '%');
            });
        }

        if ($from !== '') {
            $start = Carbon::parse($from)->startOfDay();
            $query->where('created_at', '>=', $start);
        }

        if ($to !== '') {
            $end = Carbon::parse($to)->endOfDay();
            $query->where('created_at', '<=', $end);
        }

        $paginator = $query->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        $rows = [];
        foreach ($paginator->items() as $order) {
            $subProduct = SubProducts::where('_id', $order->sub_product_id)->first();

            if ($category !== 'all') {
                $productName = $subProduct->name ?? '';
                if ($category === 'hotmail' && !str_contains(strtolower($productName), 'hotmail')) {
                    continue;
                }
                if ($category === 'tiktok' && !str_contains(strtolower($productName), 'tiktok')) {
                    continue;
                }
            }

            $rows[] = [
                'order_number' => $order->order_number,
                'purchased_at' => optional($order->created_at)->format('Y-m-d H:i:s'),
                'product_title' => $subProduct->name ?? 'N/A',
                'quantity' => $order->quantity,
                'unit_price' => $order->unit_price,
                'total_price' => $order->total_price,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'notes' => $order->notes,
            ];
        }

        return [
            'rows' => array_values($rows),
            'pagination' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ]
        ];
    }

    public function getFormattedOrderDetailsForCustomer($customerId, $orderNumber)
    {
        $order = Orders::where('order_number', $orderNumber)
            ->where('customer_id', $customerId)
            ->first();

        if (!$order) {
            return null;
        }

        $subProduct = SubProducts::where('_id', $order->sub_product_id)->first();

        $accounts = Accounts::select(['key', 'data'])
            ->where('order_id', $order->_id)
            ->get();

        $items = $accounts->map(function ($acc) {
            return $acc->data;
        })->values()->toArray();

        return [
            'order_number' => $order->order_number,
            'purchased_at' => optional($order->created_at)->format('Y-m-d H:i:s'),
            'product_title' => $subProduct->name ?? 'N/A',
            'quantity' => $order->quantity,
            'unit_price' => $order->unit_price,
            'total_price' => $order->total_price,
            'status' => $order->status,
            'payment_status' => $order->payment_status,
            'notes' => $order->notes,
            'items' => $items,
        ];
    }

    public function countQuantityPurchasedByOrder($customerId)
    {
        return Orders::where('customer_id', $customerId)
            ->where('status', Orders::STATUS['COMPLETED'])
            ->where('payment_status', Orders::PAYMENT_STATUS['PAID'])
            ->sum('quantity');
    }
}