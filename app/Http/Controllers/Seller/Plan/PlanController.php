<?php

namespace App\Http\Controllers\Seller\Plan;
use App\Services\Charge\ChargeService;
use App\Services\CurrencyRate\CurrencyRateService;
use App\Services\PaymentMethod\PaymentMethodService;
use App\Services\PaymentTransaction\PaymentTransactionAdminService;
use App\Services\PlanCheckout\PlanCheckoutService;
use Auth;
use Exception;
use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\Plan\PlanRequest;
use App\Services\Plan\PlanService;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Log;
use Request;
use Throwable;

class PlanController extends Controller
{
    protected $planService;
    protected $paymentMethodService;
    protected $planCheckoutService;
    public $currencyRateService;
    public $chargeService;
    public $paymentTransactionAdminService;

    public function __construct(PlanService $planService, PaymentMethodService $paymentMethodService, PlanCheckoutService $planCheckoutService, CurrencyRateService $currencyRateService, ChargeService $chargeService, PaymentTransactionAdminService $paymentTransactionAdminService)
    {
        $this->planService = $planService;
        $this->paymentMethodService = $paymentMethodService;
        $this->planCheckoutService = $planCheckoutService;
        $this->currencyRateService = $currencyRateService;
        $this->chargeService = $chargeService;
        $this->paymentTransactionAdminService = $paymentTransactionAdminService;
    }

    public function index()
    {
        return Inertia::render('Plan/index', [
            'plans' => fn() => $this->planService->sellerGetAllPlans(),
            'paymentMethods' => fn() => $this->paymentMethodService->listActive(),
            'currentUserPlan' => fn() => $this->chargeService->getCurrentChargeByUser(Auth::guard(config('guard.seller'))->id()),
        ]);
    }

    public function checkout(PlanRequest $request)
    {
        try {
            $dataRequest = $request->validated();
            $planId = $dataRequest['plan_id'];
            $paymentMethodId = $dataRequest['payment_method_id'];

            $user = Auth::guard(config('guard.seller'))->user();
            if (!$user) {
                throw new Exception('Unauthorized');
            }

            $plan = $this->planService->getById($planId);
            if (!$plan) {
                throw new Exception('Plan not found');
            }

            $paymentMethod = $this->paymentMethodService->findActiveById($paymentMethodId);
            if (!$paymentMethod || empty($paymentMethod->details)) {
                throw new Exception('Payment method not found');
            }

            $resultCheckout = $this->planCheckoutService->createCheckout($user, $plan, $paymentMethod);
            if (!$resultCheckout) {
                throw new Exception('Create checkout failed');
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Checkout created successfully',
                'data' => [
                    "bank_name" => $paymentMethod->name,
                    "bank_code" => $paymentMethod->key,
                    "account_name" => $paymentMethod->details['account_name'],
                    "account_number" => $paymentMethod->details['account_number'],
                    "amount" => $resultCheckout->amount,
                    "amount_vnd" => $resultCheckout->amount_vnd,
                    "content_bank" => $resultCheckout->content_bank,
                ]
            ], 200);
        } catch (Throwable $th) {
            Log::error($th, ['ip' => $request->ip(), 'user_id' => Auth::guard(config('guard.seller'))->id() ?? null]);
            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage(),
                'data' => []
            ], 500);
        }
    }

    public function pingBuyPlan(Request $request)
    {
        try {
            $sellerId = Auth::guard(config('guard.seller'))->id();
            if (empty($sellerId)) {
                throw new Exception('Unauthorized');
            }

            $data = $this->paymentTransactionAdminService->checkPurchaseCache($sellerId);

            if (empty($data)) {
                return response()->json([
                    "status" => "no_data",
                    "message" => "No purchase data available",
                ]);
            }

            $paymentTransactionId = $data['payment_transaction_id'];
            $paymentTransaction = $this->paymentTransactionAdminService->findById(
                $paymentTransactionId,
                ['transaction_id', 'amount', 'amount_vnd', 'status', 'payment_date', 'system_note', 'check_out_id', 'payment_method_id', 'charge_id'],
                ['checkout', 'paymentMethod', 'charge']
            );

            if (!$paymentTransaction) {
                throw new Exception('Payment transaction not found');
            }

            $responseData = [
                'transaction_id' => $paymentTransaction->transaction_id,
                'amount' => (float) $paymentTransaction->amount,
                'amount_vnd' => (float) $paymentTransaction->amount_vnd,
                'status' => (int) $paymentTransaction->status,
                'payment_date' => $paymentTransaction->payment_date,
                'system_note' => $paymentTransaction->system_note,
                'checkout' => [
                    'name' => $paymentTransaction?->checkout?->name ?? null,
                    'content_bank' => $paymentTransaction?->checkout?->content_bank ?? null,
                    'amount_vnd' => isset($paymentTransaction?->checkout?->amount_vnd) ? (float) $paymentTransaction?->checkout?->amount_vnd : null,
                ],
                'payment_method' => [
                    'name' => $paymentTransaction?->paymentMethod?->name ?? null,
                    'key' => $paymentTransaction?->paymentMethod?->key ?? null,
                ],
                'charge' => null
            ];

            if ($paymentTransaction->charge) {
                $responseData['charge'] = [
                    'expires_on' => $paymentTransaction->charge->expires_on,
                ];
            }

            $this->paymentTransactionAdminService->forgetPurchaseCache($sellerId);

            return response()->json([
                "status" => "success",
                "message" => "Purchase information retrieved successfully",
                "data" => $responseData
            ]);
        } catch (Throwable $th) {
            Log::error($th, ['ip' => $request->ip(), 'user_id' => Auth::guard(config('guard.seller'))->id() ?? null]);
            return response()->json([
                "status" => "error",
                "message" => "An error occurred while checking purchase status",
            ]);
        }
    }

}
