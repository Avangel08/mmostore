<?php

namespace App\Http\Controllers\Buyer\Order;

use App\Http\Controllers\Controller;
use App\Models\Mongo\Orders;
use App\Models\Mongo\Accounts;
use App\Services\Order\OrderService;
use App\Services\Setting\SettingService;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    protected $orderService;
    protected $settingService;

    public function __construct(OrderService $orderService, SettingService $settingService)
    {
        $this->orderService = $orderService;
        $this->settingService = $settingService;
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

        $requestData = [
            'page' => (int)($request->input('page', 1)),
            'perPage' => (int)($request->input('per_page', 10)),
            'search' => $request->input('search', ''),
            'category' => $request->input('category', 'all')
        ];

        $ordersData = $this->orderService->getFormattedOrdersForCustomer($customer->_id, $requestData);

        if ($request->ajax() || $request->wantsJson() || $request->header('X-Requested-With') === 'XMLHttpRequest') {
            return response()->json([
                'success' => true,
                'orders' => $ordersData
            ]);
        }
        $store = app('store');

        $settings = $this->settingService->getSettings(true);
        $result = [];
        foreach ($settings as $setting) {
            if ($setting->key === 'contacts' || $setting->key === 'domains' || $setting->key === 'menus') {
                $result[$setting->key] = json_decode($setting->value, true) ?: [];
            } else {
                $result[$setting->key] = $setting->value;
            }
        }

        return Inertia::render("Themes/{$theme}/Order/index", [
            'orders' => $ordersData,
            'store' =>  fn() => $store,
            'domainSuffix' => config('app.domain_suffix'),
            'settings' => fn() => $result
        ]);
    }

    public function show($orderNumber)
    {
        $customer = Auth::guard('buyer')->user();

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Customer not authenticated'
            ], 401);
        }

        $orderData = $this->orderService->getFormattedOrderDetailsForCustomer($customer->_id, $orderNumber);

        if (!$orderData) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

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


