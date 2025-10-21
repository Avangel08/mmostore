<?php

namespace App\Http\Controllers\Seller\Plan;
use App\Models\MySQL\PaymentMethods;
use App\Services\CurrencyRate\CurrencyRateService;
use App\Services\Order\CheckoutService;
use App\Services\PaymentMethod\PaymentMethodService;
use App\Services\PlanCheckout\PlanCheckoutService;
use Auth;
use Exception;
use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\Plan\PlanRequest;
use App\Services\Plan\PlanService;
use Inertia\Inertia;
use Log;
use Throwable;

class PlanController extends Controller
{
    protected $planService;
    protected $paymentMethodService;
    protected $planCheckoutService;
    public $currencyRateService;

    public function __construct(PlanService $planService, PaymentMethodService $paymentMethodService, PlanCheckoutService $planCheckoutService, CurrencyRateService $currencyRateService)
    {
        $this->planService = $planService;
        $this->paymentMethodService = $paymentMethodService;
        $this->planCheckoutService = $planCheckoutService;
        $this->currencyRateService = $currencyRateService;
    }

    public function index()
    {
        return Inertia::render('Plan/index', [
            'plans' => fn() => $this->planService->sellerGetAllPlans(),
            'paymentMethods' => fn() => $this->paymentMethodService->listActive()
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
}
