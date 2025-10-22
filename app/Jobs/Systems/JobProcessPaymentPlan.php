<?php

namespace App\Jobs\Systems;

use App\Models\MySQL\CheckOuts;
use App\Models\MySQL\PaymentTransactions;
use App\Services\Charge\ChargeService;
use App\Services\CurrencyRate\CurrencyRateService;
use App\Services\Home\UserService;
use App\Services\PaymentTransaction\PaymentTransactionService;
use App\Services\Plan\PlanService;
use App\Services\PlanCheckout\PlanCheckoutService;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Throwable;

class JobProcessPaymentPlan implements ShouldQueue
{
    use Queueable;

    protected $contentBank;
    protected $transactionId;

    /**
     * Create a new job instance.
     */
    public function __construct($contentBank, $transactionId)
    {
        $this->contentBank = $contentBank;
        $this->transactionId = $transactionId;
        $this->queue = 'active-plan';
    }

    /**
     * Execute the job.
     */
    public function handle(
        PlanCheckoutService $planCheckoutService,
        PlanService $planService,
        UserService $userService,
        PaymentTransactionService $paymentTransactionService,
        CurrencyRateService $currencyRateService,
        ChargeService $chargeService
    ): void {
        echo "==========================================Start JobProcessPaymentPlan==========================================" . PHP_EOL;

        try {
            $planCheckout = $planCheckoutService->findByContentBank($this->contentBank);

            if (empty($planCheckout)) {
                echo "Plan checkout data not found" . PHP_EOL;
                echo "content_bank: " . $this->contentBank . PHP_EOL;
                return;
            }

            $userId = $planCheckout->user_id;
            $user = $userService->findById($userId);
            if (empty($user)) {
                echo "User not found" . PHP_EOL;
                echo "user_id: " . $userId . PHP_EOL;
                return;
            }

            $planId = $planCheckout->plan_id;
            $plan = $planService->getById($planId);
            if (empty($plan)) {
                echo "Plan not found" . PHP_EOL;
                echo "plan_id: " . $planId . PHP_EOL;
                return;
            }

            $charge = $chargeService->getCurrentChargeByUser($userId);

            if ($charge) {
                
            }

            $chargeService->create([
                'user_id' => $userId,
                'type' => $planCheckout->type,
                'name' => $planCheckout->name,
                'interval' => $planCheckout->interval,
                'interval_type' => $planCheckout->interval_type,
                'feature' => $planCheckout->feature,
                'active_on' => Carbon::now(),
                'expires_on' => '', // TODO: Set expires_on
                'check_out_id' => $planCheckout->id,
                'creator_id' => $planCheckout->creator_id,
            ]);

            $paymentTransactionService->create([
                'user_id' => $userId,
                'check_out_id' => $planCheckout->id,
                'payment_method_id' => $planCheckout->payment_method_id,
                'amount' => $currencyRateService->convertVNDToUSD($planCheckout->amount_vnd),
                'amount_vnd' => $planCheckout->amount_vnd,
                'currency' => 'VND',
                'transaction_id' => $this->transactionId,
                'payment_date' => Carbon::now(),
                'creator_id' => $userId,
                'status' => PaymentTransactions::STATUS['COMPLETE'],
                'active_plan_date' => Carbon::now(),
                'charge_id' => $charge->id,
            ]);

            $planCheckoutService->update($planCheckout, ['status' => CheckOuts::STATUS['COMPLETE']]);
        } catch (Throwable $th) {
            echo 'Lỗi JobProcessPaymentPlan: ' . $th->getMessage() . PHP_EOL;
            throw $th;
        }

        echo "==========================================End JobProcessPaymentPlan==========================================" . PHP_EOL;
    }
}
