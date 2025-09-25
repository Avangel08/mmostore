<?php

namespace App\Http\Controllers\Seller\PaymentHistory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\PaymentHistory\PaymentHistoryRequest;
use App\Services\BalanceHistory\BalanceHistoryService;
use App\Services\CheckBank\VietCombank;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class PaymentHistoryController extends Controller
{
    private $balanceHistoryService;
    
    public function __construct(BalanceHistoryService $balanceHistoryService)
    {
        $this->balanceHistoryService = $balanceHistoryService;
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
            'paymentHistories' => fn () => $this->balanceHistoryService->getForTable($request),
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
        $data = $request->all();
        return back()->with('success', 'Category created successfully');
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

    public function verifyPayment(PaymentHistoryRequest $request)
    {
        $data = $request->validated();
        $vietcombankService = new VietCombank(trim($data['user_name']), trim($data['password']), trim($data['account_number']));
        $loginResult = $vietcombankService->doLogin();
        if(isset($loginResult) && !$loginResult['success']){
            return back()->with('error', 'Verified failed');
        }
        $listAccountResult = $vietcombankService->getlistAccount();
        if(isset($listAccountResult) && !$listAccountResult->code == '00'){
            return back()->with('error', 'Verified failed');
        }

        dd($loginResult);
        $listAcc = $listAccountResult->DDAccounts;
        $checkAcc = array_filter($listAcc, function($item) use ($data){
            return $item->accountNumber == trim($data['account_number']) && $item->customerName == trim($data['account_name']);
        });
        if(empty($checkAcc) || count($checkAcc) == 0){
            return back()->with('error', 'Verified failed');
        }
    
        $history = $vietcombankService->getHistories(Carbon::now()->subDays(7)->format('d/m/Y'), Carbon::now()->format('d/m/Y'), $data['account_number']);
        dd($history);
        if($loginResult['success']){
            return back()->with('success', 'Verified successfully');
        }else{
            return back()->with('error', 'Verified failed');
        }
    }
}
