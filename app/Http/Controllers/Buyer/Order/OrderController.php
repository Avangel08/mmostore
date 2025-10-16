<?php

namespace App\Http\Controllers\Buyer\Order;

use App\Http\Controllers\Controller;
use App\Models\Mongo\Orders;
use App\Models\Mongo\SubProducts;
use App\Models\Mongo\Accounts;
use App\Services\Order\OrderService;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function page(Request $request): Response
    {
        $theme = 'Theme_1';
        $user = Auth::guard('buyer')->user();
        return Inertia::render("Themes/{$theme}/Orders/index", [
            'user' => $user,
            'isAuthenticated' => $user !== null,
        ]);
    }

    public function index(Request $request)
    {
        $customer = Auth::guard('buyer')->user();
        $theme = session('theme') ?? "theme_1";

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Customer not authenticated'
            ], 401);
        }

        $perPage = (int)($request->input('per_page', 10));
        $page = (int)($request->input('page', 1));
        $search = $request->input('search', '');
        $category = $request->input('category', 'all');

        $requestData = [
            'page' => $page,
            'perPage' => $perPage,
            'search' => $search,
            'category' => $category
        ];

        $paginator = $this->orderService->getByCustomerId($customer->_id, $requestData);
        
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
                'purchased_at' => optional($order->created_at)->toISOString(),
                'product_title' => $subProduct->name ?? 'N/A',
                'quantity' => $order->quantity,
                'unit_price' => $order->unit_price,
                'total_price' => $order->total_price,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'notes' => $order->notes,
            ];
        }

        if ($request->ajax() || $request->wantsJson() || $request->header('X-Requested-With') === 'XMLHttpRequest') {
            return response()->json([
                'success' => true,
                'orders' => [
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

        return Inertia::render("Themes/{$theme}/Order/index", [
            'orders' => [
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

    public function show($orderNumber)
    {
        $customer = Auth::guard('buyer')->user();
        $theme = session('theme') ?? "theme_1";
        $store = app('store');

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Customer not authenticated'
            ], 401);
        }

        $order = Orders::where('order_number', $orderNumber)
            ->where('customer_id', $customer->_id)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        $subProduct = SubProducts::where('_id', $order->sub_product_id)->first();

        $accounts = Accounts::select(['key', 'data'])
            ->where('order_id', $order->_id)
            ->get();

        $items = $accounts->map(function ($acc) {
            return [
                'key' => $acc->key,
                'data' => $acc->data,
            ];
        })->values()->toArray();

        $orderData = [
            'order_number' => $order->order_number,
            'purchased_at' => optional($order->created_at)->toISOString(),
            'product_title' => $subProduct->name ?? 'N/A',
            'quantity' => $order->quantity,
            'unit_price' => $order->unit_price,
            'total_price' => $order->total_price,
            'status' => $order->status,
            'payment_status' => $order->payment_status,
            'notes' => $order->notes,
            'items' => $items,
        ];

        return response()->json([
            'success' => true,
            'data' => $orderData
        ]);
    }

    public function download($orderNumber)
    {
        $customer = Auth::guard('buyer')->user();

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Customer not authenticated'
            ], 401);
        }

        $order = Orders::where('order_number', $orderNumber)
            ->where('customer_id', $customer->_id)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        if ($order->status !== 'COMPLETED') {
            return response()->json([
                'success' => false,
                'message' => 'Order is not completed yet'
            ], 400);
        }

        $accounts = Accounts::select(['data'])
            ->where('order_id', $order->_id)
            ->get();

        $txtContent = '';

        foreach ($accounts as $acc) {
            $lineData = (string)$acc->data;
            $txtContent .= $lineData . "\n";
        }

        $filename = "{$orderNumber}.txt";

        return response($txtContent)
            ->header('Content-Type', 'text/plain; charset=UTF-8')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }
}


