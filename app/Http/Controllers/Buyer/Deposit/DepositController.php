<?php

namespace App\Http\Controllers\Buyer\Deposit;

use App\Http\Controllers\Controller;
use App\Models\Mongo\Deposits;
use App\Services\Deposits\DepositService;
use App\Services\CurrencyRate\CurrencyRateService;
use App\Services\PaymentMethod\PaymentMethodService;
use App\Services\Customer\CustomerService;
use App\Services\CheckBank\CheckBankService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DepositController extends Controller
{
    protected $depositService;
    protected $paymentMethodService;
    protected $currencyRateService;
    protected $customerService;
    protected $checkBankService;
    public function __construct(
        DepositService $depositService,
        PaymentMethodService $paymentMethodService,
        CurrencyRateService $currencyRateService,
        CustomerService $customerService,
        CheckBankService $checkBankService
    ) {
        $this->depositService = $depositService;
        $this->paymentMethodService = $paymentMethodService;
        $this->currencyRateService = $currencyRateService;
        $this->customerService = $customerService;
        $this->checkBankService = $checkBankService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $theme = session('theme') ?? "Theme_1";
        return Inertia::render("Themes/{$theme}/Deposit/index", []);
    }

    public function checkout(Request $request)
    {
        try {
            $data = $request->all();
            $ownerStoreId = session('ownerStoreId');
            $customer = Auth::guard(config('guard.buyer'))->user();
            //payment method của user setting
            $paymentMethod = $this->paymentMethodService->findByUserId($ownerStoreId);
            if (!$paymentMethod) {
                return response()->json([
                    "status" => "error",
                    "message" => "Payment method not found",
                    "data" => []
                ]);
            }

            $dataInsert = [
                'customer_id' => $customer->_id,
                'email' => $customer->email,
                'payment_method_id' => $paymentMethod->id,
                'amount' => $this->currencyRateService->convertVNDToUSD($data['amount']),
                'amount_vnd' => $data['amount'],
                'currency' => 'USD',
                'status' => Deposits::STATUS['PENDING']
            ];

            $result = $this->depositService->checkExist($dataInsert);
            if (!$result) {
                $result = $this->depositService->create($dataInsert);
                if ($result) {
                    $contentBank = $this->checkBankService->genContentBank($ownerStoreId, $result->_id);
                    $this->depositService->update($result, ['content_bank' => $contentBank]);
                }
            }

            if ($result && !empty($paymentMethod->details)) {
                return response()->json([
                    "status" => "success",
                    "message" => "Deposit created successfully",
                    'data' => [
                        "bank_name" => $paymentMethod->name,
                        "bank_code" => $paymentMethod->key,
                        "account_name" => $paymentMethod->details['account_name'],
                        "account_number" => $paymentMethod->details['account_number'],
                        "amount" => $this->currencyRateService->convertVNDToUSD($data['amount']),
                        "amount_vnd" => $data['amount'],
                        "content_bank" => $result->content_bank ?? '',
                    ]
                ]);
            }

            return response()->json([
                "status" => "error",
                "message" => "Deposit created failed",
                "data" => []
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "status" => "error",
                "message" => $th->getMessage(),
                "data" => []
            ]);
        }
    }

    public function pingDeposit(Request $request)
    {
        $customer = Auth::guard(config('guard.buyer'))->user();
        if (isset($customer) && isset($customer->deposit_amount) && $customer->deposit_amount > 0) {
            $this->customerService->update($customer, ['deposit_amount' => 0]);
            return response()->json([
                "status" => "success",
                "message" => "Ping deposit",
                "data" => []
            ]);
        }
        return response()->json([
            "status" => "error",
            "message" => "Ping deposit",
            "data" => []
        ]);
    }
}
