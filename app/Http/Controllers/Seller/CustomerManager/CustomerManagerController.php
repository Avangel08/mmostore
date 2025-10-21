<?php

namespace App\Http\Controllers\Seller\CustomerManager;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\CustomerManager\CustomerManagerRequest;
use App\Models\Mongo\BalanceHistories;
use App\Models\Mongo\PaymentMethodSeller;
use App\Services\Customer\CustomerService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use App\Services\BalanceHistory\BalanceHistoryService;
use App\Services\CurrencyRate\CurrencyRateService;
use App\Services\PaymentMethodSeller\PaymentMethodSellerService;

class CustomerManagerController extends Controller
{
    protected $customerService;
    protected $paymentMethodSellerService;
    protected $balanceHistoryService;
    protected $currencyRateService;
    public function __construct(
        CustomerService $customerService, 
        PaymentMethodSellerService $paymentMethodSellerService,
        BalanceHistoryService $balanceHistoryService,
        CurrencyRateService $currencyRateService
        )
    {
        $this->customerService = $customerService;
        $this->paymentMethodSellerService = $paymentMethodSellerService;
        $this->balanceHistoryService = $balanceHistoryService;
        $this->currencyRateService = $currencyRateService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $request = $request->all();
        $paymentMethods = $this->paymentMethodSellerService->listActive();
        $listPaymentType = array_flip(PaymentMethodSeller::TYPE);
        return Inertia::render('CustomerManager/index', [
            'customers' => fn() => $this->customerService->getForTable($request),
            'paymentMethods' => $paymentMethods,
            'listPaymentType' => $listPaymentType,
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
        
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $result = $this->customerService->findById($id);
        if(!$result) {
            return response()->json([
                'status' => "error",
                'message' => 'Customer not found',
                'data' => null,
            ]);
        }
        return response()->json([
            'status' => "success",
            'message' => 'Customer fetched successfully',
            'data' => $result,
        ]);
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
    
    public function deposit(CustomerManagerRequest $request)
    {
        try {
            $data = $request->validated();
            $customer = $this->customerService->findById($data['customer_id']);
            if(!$customer) {
                return back()->with('error', __('Customer not found'));
            }
            $amount = $amount_vnd = $before = $after = 0;
            if($data['currency'] == 'USD') {
                $amount = $data['amount'];
                $amount_vnd = $this->currencyRateService->convertUSDToVND($data['amount']);
            } else {
                $amount = $this->currencyRateService->convertVNDToUSD($data['amount']);
                $amount_vnd = $data['amount'];
            }

            if($data['transaction_type'] == BalanceHistories::TYPE['deposit']) {
                $before = $customer->balance;
                $after = $before + $amount_vnd;
            }
            if($data['transaction_type'] == BalanceHistories::TYPE['deduct_money']) {
                $before = $customer->balance;
                $after = $before - $amount_vnd;
            }

            $dataInsert = [
                'gate_way' => BalanceHistories::GATEWAY['SYSTEM'],
                'customer_id' => $customer['_id'],
                'payment_method_id' => $data['payment_method_id'],
                'type' => intval($data['transaction_type']),
                'amount' => $amount,
                'amount_vnd' => $amount_vnd,
                'before' => $before,
                'after' => $after,
                'currency' => $data['currency'],
                'transaction' => $data['transaction_code'],
                'note' => $data['note'],
                'date_at' => Carbon::now()->toDateTimeString(),
            ];
            
            $customerUpdated = $this->customerService->update($customer, ['balance' => $after]);
            $result = $this->balanceHistoryService->create($dataInsert);
            if($result && $customerUpdated) {
                return back()->with('success', __('Update successfully'));
            }
            return back()->with('error', __('Update failed'));
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.seller'))->id() ?? null]);
            return back()->with('error', __('Update failed'));
        }
    }
}
