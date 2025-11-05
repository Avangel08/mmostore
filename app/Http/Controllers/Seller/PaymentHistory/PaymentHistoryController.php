<?php

namespace App\Http\Controllers\Seller\PaymentHistory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\PaymentHistory\PaymentHistoryRequest;
use App\Models\MySQL\PaymentMethods;
use App\Services\BalanceHistory\BalanceHistoryService;
use App\Services\CheckBank\VietCombank;
use App\Services\PaymentMethod\PaymentMethodService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class PaymentHistoryController extends Controller
{
    private $balanceHistoryService;
    private $paymentMethodService;

    public function __construct(BalanceHistoryService $balanceHistoryService, PaymentMethodService $paymentMethodService)
    {
        $this->balanceHistoryService = $balanceHistoryService;
        $this->paymentMethodService = $paymentMethodService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // if (auth(config('guard.seller'))->user()->cannot('payment-history_view')) {
        //     return abort(403);
        // }

        $request = $request->all();
        return Inertia::render('PaymentHistory/index', [
            'paymentHistories' => fn() => $this->balanceHistoryService->getForTable($request),
            'typeOptions' => $this->balanceHistoryService->getTypeOptions(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PaymentHistoryRequest $request)
    {
        
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit()
    {
        
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
