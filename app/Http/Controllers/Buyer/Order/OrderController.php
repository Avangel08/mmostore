<?php

namespace App\Http\Controllers\Buyer\Order;

use App\Http\Controllers\Controller;
use App\Models\Mongo\Accounts;
use App\Models\Mongo\SubProducts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $customer = Auth::guard('buyer')->user();
        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Customer not authenticated'
            ], 401);
        }

        $perPage = (int)($request->input('per_page', 10));
        $page = (int)($request->input('page', 1));

        $query = Accounts::where('customer_id', $customer->_id)
            ->whereNotNull('order_id')
            ->orderBy('created_at', 'desc');

        // Group by order_id in PHP layer for Mongo Eloquent simplicity
        $paginator = $query->paginate($perPage, ['*'], 'page', $page);
        $grouped = [];

        foreach ($paginator->items() as $acc) {
            $orderId = $acc->order_id;
            if (!isset($grouped[$orderId])) {
                $grouped[$orderId] = [
                    'order_id' => $orderId,
                    'created_at' => $acc->created_at,
                    'items' => [],
                ];
            }
            $grouped[$orderId]['items'][] = $acc;
        }

        // Build response rows
        $rows = [];
        foreach ($grouped as $group) {
            $first = $group['items'][0];
            $subProduct = SubProducts::where('_id', $first->sub_product_id)->first();
            $quantity = count($group['items']);
            $unitPrice = $subProduct->price ?? 0;
            $total = $unitPrice * $quantity;

            $rows[] = [
                'order_code' => $group['order_id'],
                'purchased_at' => optional($group['created_at'])->toISOString(),
                'product_title' => $subProduct->name ?? 'N/A',
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'total_price' => $total,
                'status' => 'completed',
            ];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'rows' => array_values($rows),
                'pagination' => [
                    'current_page' => $paginator->currentPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                    'last_page' => $paginator->lastPage(),
                ]
            ]
        ]);
    }
}


