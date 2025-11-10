<?php

namespace App\Services\Dashboard;

use App\Models\Mongo\BalanceHistories;
use App\Models\Mongo\Customers;
use App\Models\Mongo\Orders;
use Carbon\Carbon;

class DashboardService
{
    /**
     * Get dashboard metrics for the given date range
     */
    public function getMetrics(Carbon $startDate, Carbon $endDate): array
    {
        // Previous period for comparison (same duration before start date)
        $daysDiff = $startDate->diffInDays($endDate);
        $previousStartDate = $startDate->copy()->subDays($daysDiff + 1);
        $previousEndDate = $startDate->copy()->subDay();

        // Get current period data
        $totalEarnings = $this->getTotalEarnings($startDate, $endDate);
        $totalOrders = $this->getTotalOrders($startDate, $endDate);
        $totalDeposits = $this->getTotalDeposits($startDate, $endDate);
        $newCustomers = $this->getNewCustomers($startDate, $endDate);

        // Get previous period data for comparison
        $previousEarnings = $this->getTotalEarnings($previousStartDate, $previousEndDate);
        $previousOrders = $this->getTotalOrders($previousStartDate, $previousEndDate);
        $previousDeposits = $this->getTotalDeposits($previousStartDate, $previousEndDate);
        $previousNewCustomers = $this->getNewCustomers($previousStartDate, $previousEndDate);

        return [
            'total_earnings' => [
                'value' => $totalEarnings,
                'previous' => $previousEarnings,
                'percentage_change' => $this->calculatePercentageChange($totalEarnings, $previousEarnings)
            ],
            'total_orders' => [
                'value' => $totalOrders,
                'previous' => $previousOrders,
                'percentage_change' => $this->calculatePercentageChange($totalOrders, $previousOrders)
            ],
            'total_deposits' => [
                'value' => $totalDeposits,
                'previous' => $previousDeposits,
                'percentage_change' => $this->calculatePercentageChange($totalDeposits, $previousDeposits)
            ],
            'new_customers' => [
                'value' => $newCustomers,
                'previous' => $previousNewCustomers,
                'percentage_change' => $this->calculatePercentageChange($newCustomers, $previousNewCustomers)
            ]
        ];
    }

    /**
     * Get total earnings from paid orders
     */
    private function getTotalEarnings(Carbon $startDate, Carbon $endDate): float
    {
        return Orders::where('status', Orders::STATUS['COMPLETED'])
            ->where('payment_status', Orders::PAYMENT_STATUS['PAID'])
            ->whereBetween('created_at', [$startDate, $endDate->endOfDay()])
            ->sum('total_price');
    }

    /**
     * Get total number of orders
     */
    private function getTotalOrders(Carbon $startDate, Carbon $endDate): int
    {
        return Orders::whereBetween('created_at', [$startDate, $endDate->endOfDay()])->count();
    }

    /**
     * Get total amount of customer deposits (type = 1)
     * Note: date_at is stored as string in MongoDB
     */
    private function getTotalDeposits(Carbon $startDate, Carbon $endDate): float
    {
        $startDateString = $startDate->copy()->startOfDay()->toDateTimeString();
        $endDateString = $endDate->copy()->endOfDay()->toDateTimeString();
        
        return BalanceHistories::where('type', BalanceHistories::TYPE['deposit'])
            ->where('date_at', '>=', $startDateString)
            ->where('date_at', '<=', $endDateString)
            ->sum('amount_vnd');
    }

    /**
     * Get total customers count
     */
    private function getTotalCustomers(Carbon $startDate, Carbon $endDate): int
    {
        return Customers::whereBetween('created_at', [$startDate, $endDate->endOfDay()])->count();
    }

    /**
     * Get new customers count
     */
    private function getNewCustomers(Carbon $startDate, Carbon $endDate): int
    {
        return Customers::whereBetween('created_at', [$startDate, $endDate->endOfDay()])->count();
    }

    /**
     * Calculate percentage change between current and previous value
     */
    private function calculatePercentageChange(float $current, float $previous): float
    {
        if ($previous == 0) {
            return $current > 0 ? 100 : 0;
        }
        
        $change = (($current - $previous) / $previous) * 100;
        return round($change, 2);
    }

    /**
     * Get revenue metrics for chart
     */
    public function getRevenueMetrics(Carbon $startDate, Carbon $endDate): array
    {
        $daysDiff = $startDate->diffInDays($endDate);
        $previousStartDate = $startDate->copy()->subDays($daysDiff + 1);
        $previousEndDate = $startDate->copy()->subDay();

        $currentOrders = Orders::whereBetween('created_at', [$startDate, $endDate->endOfDay()])->count();

        $currentEarnings = Orders::where('status', Orders::STATUS['COMPLETED'])
            ->where('payment_status', Orders::PAYMENT_STATUS['PAID'])
            ->whereBetween('created_at', [$startDate, $endDate->endOfDay()])
            ->sum('total_price');
        
        $currentRefunds = Orders::where('payment_status', Orders::PAYMENT_STATUS['REFUNDED'])
            ->whereBetween('created_at', [$startDate, $endDate->endOfDay()])
            ->count();

        $totalCustomers = Customers::whereBetween('created_at', [$startDate, $endDate->endOfDay()])->count();

        $conversionRatio = $totalCustomers > 0 ? ($currentOrders / $totalCustomers) * 100 : 0;

        $previousOrders = Orders::whereBetween('created_at', [$previousStartDate, $previousEndDate->endOfDay()])->count();

        $previousEarnings = Orders::where('status', Orders::STATUS['COMPLETED'])
            ->where('payment_status', Orders::PAYMENT_STATUS['PAID'])
            ->whereBetween('created_at', [$previousStartDate, $previousEndDate->endOfDay()])
            ->sum('total_price');

        $previousRefunds = Orders::where('payment_status', Orders::PAYMENT_STATUS['REFUNDED'])
            ->whereBetween('created_at', [$previousStartDate, $previousEndDate->endOfDay()])
            ->count();

        $previousCustomers = Customers::whereBetween('created_at', [$previousStartDate, $previousEndDate->endOfDay()])->count();
        $previousConversionRatio = $previousCustomers > 0 ? ($previousOrders / $previousCustomers) * 100 : 0;

        return [
            'orders' => [
                'value' => $currentOrders,
                'previous' => $previousOrders,
                'percentage_change' => $this->calculatePercentageChange($currentOrders, $previousOrders)
            ],
            'earnings' => [
                'value' => $currentEarnings,
                'previous' => $previousEarnings,
                'percentage_change' => $this->calculatePercentageChange($currentEarnings, $previousEarnings)
            ],
            'refunds' => [
                'value' => $currentRefunds,
                'previous' => $previousRefunds,
                'percentage_change' => $this->calculatePercentageChange($currentRefunds, $previousRefunds)
            ],
            'conversion_ratio' => [
                'value' => $conversionRatio,
                'previous' => $previousConversionRatio,
                'percentage_change' => $this->calculatePercentageChange($conversionRatio, $previousConversionRatio)
            ]
        ];
    }

    public function getBestSellingProducts(Carbon $startDate, Carbon $endDate, int $page = 1, int $perPage = 10): array
    {
        $orders = Orders::whereBetween('created_at', [$startDate, $endDate->endOfDay()])
            ->with('product:_id,name')
            ->get();

        $productStats = [];
        foreach ($orders as $order) {
            $productId = $order->product_id;
            
            if (!isset($productStats[$productId])) {
                $productStats[$productId] = [
                    'id' => $productId,
                    'label' => $order->product->name ?? 'Unknown Product',
                    'orders' => 0,
                    'total_amount' => 0,
                    'total_price' => 0,
                    'count' => 0
                ];
            }
            
            $productStats[$productId]['orders'] += $order->quantity ?? 0;
            $productStats[$productId]['total_amount'] += $order->total_price ?? 0;
            $productStats[$productId]['total_price'] += $order->unit_price ?? 0;
            $productStats[$productId]['count']++;
        }
        
        foreach ($productStats as &$stat) {
            $stat['price'] = $stat['count'] > 0 ? $stat['total_price'] / $stat['count'] : 0;
            $stat['amount'] = $stat['total_amount'];
            unset($stat['total_price'], $stat['total_amount']);
        }
        
        usort($productStats, function($a, $b) {
            return $b['orders'] - $a['orders'];
        });
        
        $total = count($productStats);
        $offset = ($page - 1) * $perPage;
        $items = array_slice($productStats, $offset, $perPage);
        
        return [
            'data' => $items,
            'current_page' => $page,
            'per_page' => $perPage,
            'total' => $total,
            'last_page' => (int) ceil($total / $perPage)
        ];
    }

    /**
     * Get recent orders
     */
    public function getRecentOrders(Carbon $startDate, Carbon $endDate, int $page = 1, int $perPage = 10): array
    {
        $total = Orders::whereBetween('created_at', [$startDate, $endDate->endOfDay()])->count();
        
        $orders = Orders::with(['customer:_id,name', 'product:_id,name'])
            ->whereBetween('created_at', [$startDate, $endDate->endOfDay()])
            ->orderBy('created_at', 'desc')
            ->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get();

        $items = $orders->map(function ($order) {
            return [
                'id' => $order->_id,
                'order_number' => $order->order_number ?? 'N/A',
                'customer_name' => $order->customer->name ?? 'Unknown',
                'product_name' => $order->product->name ?? 'Unknown',
                'amount' => $order->total_price ?? 0,
                'status' => $order->status ?? 'PENDING',
                'payment_status' => $order->payment_status ?? 'PENDING',
                'notes' => $order->notes ?? '',
                'created_at' => $order->created_at ? \Carbon\Carbon::parse($order->created_at)->format('d M Y') : 'N/A'
            ];
        })->toArray();

        return [
            'data' => $items,
            'current_page' => $page,
            'per_page' => $perPage,
            'total' => $total,
            'last_page' => (int) ceil($total / $perPage)
        ];
    }

    /**
     * Get daily data for charts
     */
    public function getDailyChartData(Carbon $startDate, Carbon $endDate): array
    {
        $dailyData = [];
        $currentDate = $startDate->copy();
        
        while ($currentDate <= $endDate) {
            $dayStart = $currentDate->copy()->startOfDay();
            $dayEnd = $currentDate->copy()->endOfDay();
            $dateKey = $currentDate->format('Y-m-d');
            
            // Get total earnings for the day
            $earnings = Orders::where('status', Orders::STATUS['COMPLETED'])
                ->where('payment_status', Orders::PAYMENT_STATUS['PAID'])
                ->whereBetween('created_at', [$dayStart, $dayEnd])
                ->sum('total_price');
            
            // Get total orders for the day
            $orders = Orders::whereBetween('created_at', [$dayStart, $dayEnd])->count();
            
            // Get total deposits for the day (type = 1: user nạp tiền vào hệ thống)
            // Note: date_at is stored as string in MongoDB
            $dayStartString = $dayStart->toDateTimeString();
            $dayEndString = $dayEnd->toDateTimeString();
            
            $deposits = BalanceHistories::where('type', BalanceHistories::TYPE['deposit'])
                ->where('date_at', '>=', $dayStartString)
                ->where('date_at', '<=', $dayEndString)
                ->sum('amount_vnd');
            
            // Get new customers for the day
            $newCustomers = Customers::whereBetween('created_at', [$dayStart, $dayEnd])->count();
            
            $dailyData[$dateKey] = [
                'date' => $currentDate->format('d-m'),
                'earnings' => round($earnings, 2),
                'orders' => $orders,
                'deposits' => round($deposits, 2),
                'new_customers' => $newCustomers
            ];
            
            $currentDate->addDay();
        }
        
        return $dailyData;
    }
}

