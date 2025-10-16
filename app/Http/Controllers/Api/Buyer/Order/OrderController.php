<?php

namespace App\Http\Controllers\Api\Buyer\Order;

use App\Http\Controllers\Controller;
use App\Models\Mongo\Accounts;
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
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $requestData = [
            'page' => (int)($request->input('page', 1)),
            'perPage' => (int)($request->input('per_page', 10)),
            'search' => $request->input('search', ''),
            'category' => $request->input('category', 'all'),
        ];

        $ordersData = $this->orderService->getFormattedOrdersForCustomer($customer->_id, $requestData);

        return response()->json([
            'success' => true,
            'orders' => $ordersData
        ]);
    }

    public function show(Request $request, string $orderNumber)
    {
        $customer = Auth::guard('buyer_api')->user();
        if (!$customer) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $orderData = $this->orderService->getFormattedOrderDetailsForCustomer($customer->_id, $orderNumber);

        if (!$orderData) {
            return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        }

        return response()->json([
            'success' => true,
            'order' => $orderData,
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
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            $productId = $request->input('product_id');
            $subProductId = $request->input('sub_product_id');
            $quantity = (int) $request->input('quantity');

            $result = $this->checkoutService->checkout($productId, $subProductId, $customer->_id, $quantity, $store->id, PaymentMethodSeller::KEY['API']);

            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $result['message'] ?? 'Checkout failed',
                ], 500);
            }

            return response()->json([
                'success' => true,
                'message' => 'Order created and payment processing started',
                'order_number' => $result['order_number'] ?? null,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error processing purchase request: ' . $e->getMessage()
            ], 500);
        }
    }
}


