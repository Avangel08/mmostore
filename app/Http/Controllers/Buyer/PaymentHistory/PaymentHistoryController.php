<?php

namespace App\Http\Controllers\Buyer\PaymentHistory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Services\BalanceHistory\BalanceHistoryService;

class PaymentHistoryController extends Controller
{
    protected $balanceHistoryService;
    public function __construct(BalanceHistoryService $balanceHistoryService)
    {
        $this->balanceHistoryService = $balanceHistoryService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $theme = session('theme') ?? "theme_1";
        $request = $request->all();
        $customerId = Auth::guard('buyer')->user()->id;
        $listBalanceHistory = $this->balanceHistoryService->getForTableCustomer($request, $customerId);
        return Inertia::render("Themes/{$theme}/PaymentHistory/index", [
            'listBalanceHistory' => $listBalanceHistory,
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
    public function store(Request $request)
    {
        //
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
    public function edit(string $id)
    {
        //
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
