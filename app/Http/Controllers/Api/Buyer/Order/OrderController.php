<?php

namespace App\Http\Controllers\Api\Buyer\Order;

use App\Http\Controllers\Controller;
use App\Models\Mongo\Accounts;
use App\Models\Mongo\BalanceHistories;
use App\Models\Mongo\Orders;
use App\Models\Mongo\PaymentMethodSeller;
use App\Models\Mongo\SubProducts;
use App\Services\Order\CheckoutService;
use App\Services\Order\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    protected $orderService;
    protected $checkoutService;

    public function __construct(
        OrderService $orderService,
        CheckoutService $checkoutService
    )
    {
        $this->orderService = $orderService;
        $this->checkoutService = $checkoutService;
    }

    public function index(Request $request)
    {
        $customer = Auth::guard('buyer_api')->user();
        if (!$customer) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
        }

        $requestData = [
            'page' => (int)($request->input('page', 1)),
            'perPage' => (int)($request->input('per_page', 10)),
            'search' => $request->input('search', ''),
            'category' => $request->input('category', 'all'),
            'from' => $request->input('from', ''),
            'to' => $request->input('to', ''),
        ];

        $ordersData = $this->orderService->getFormattedOrdersForCustomer($customer->_id, $requestData);

        return response()->json([
            'status' => 'success',
            'message' => 'Orders retrieved successfully',
            'data' => $ordersData
        ]);
    }

    public function show(Request $request, string $orderNumber)
    {
        $customer = Auth::guard('buyer_api')->user();
        if (!$customer) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
        }

        $orderData = $this->orderService->getFormattedOrderDetailsForCustomer($customer->_id, $orderNumber);

        if (!$orderData) {
            return response()->json(['status' => 'error', 'message' => 'Order not found'], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Order retrieved successfully',
            'data' => $orderData
        ]);
    }

    public function checkout(Request $request)
    {
        try {
            $request->validate([
                'product_id' => 'required|string',
                'sub_product_id' => 'required|string',
                'quantity' => 'required|integer|min:1',
            ]);

            $store = app('store');

            $customer = Auth::guard('buyer_api')->user();
            if (!$customer) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 401);
            }

            $productId = $request->input('product_id');
            $subProductId = $request->input('sub_product_id');
            $quantity = (int) $request->input('quantity');

            $result = $this->checkoutService->checkout($productId, $subProductId, $customer->_id, $quantity, $store->id, BalanceHistories::GATEWAY['API']);

            return response()->json([
                'status' => $result['status'],
                'message' => $result['message'],
                'data' => $result['data'] ?? null,
            ], $result['code']);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error processing purchase request: ' . $e->getMessage()
            ], 500);
        }
    }
}


