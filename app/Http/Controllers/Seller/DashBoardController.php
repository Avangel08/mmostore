<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Services\Dashboard\DashboardService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\View;
use Inertia\Inertia;
use Inertia\Response;

class DashBoardController extends Controller
{
    protected $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    public function index(Request $request)
    {
        $guard = config('guard.seller');
        $user = Auth::guard($guard)->user();
        
        $currentStore = request()->get('current_store');
        $subdomain = $currentStore ? $currentStore->id : 'unknown';
        
        $startDate = $request->input('start_date', Carbon::today()->format('Y-m-d'));
        $endDate = $request->input('end_date', Carbon::today()->format('Y-m-d'));
        
        $startDateCarbon = Carbon::parse($startDate)->startOfDay();
        $endDateCarbon = Carbon::parse($endDate)->endOfDay();
        
        $productPage = $request->input('product_page', 1);
        $orderPage = $request->input('order_page', 1);
        
        $metrics = $this->dashboardService->getMetrics($startDateCarbon, $endDateCarbon);
        $revenueMetrics = $this->dashboardService->getRevenueMetrics($startDateCarbon, $endDateCarbon);
        $bestSellingProducts = $this->dashboardService->getBestSellingProducts($startDateCarbon, $endDateCarbon, $productPage, 10);
        $recentOrders = $this->dashboardService->getRecentOrders($startDateCarbon, $endDateCarbon, $orderPage, 10);
        $dailyChartData = $this->dashboardService->getDailyChartData($startDateCarbon, $endDateCarbon);

        return Inertia::render('Dashboard/index', [
            'user' => $user,
            'subdomain' => $subdomain,
            'metrics' => $metrics,
            'revenue_metrics' => $revenueMetrics,
            'best_selling_products' => $bestSellingProducts,
            'recent_orders' => $recentOrders,
            'daily_chart_data' => $dailyChartData,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate
            ]
        ]);
    }
}


