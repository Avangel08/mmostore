<?php

namespace App\Jobs\Systems;

use App\Helpers\Helpers;
use App\Models\MySQL\CheckOuts;
use App\Models\MySQL\PaymentTransactions;
use App\Services\Charge\ChargeService;
use App\Services\CurrencyRate\CurrencyRateService;
use App\Services\Home\UserService;
use App\Services\PaymentTransaction\PaymentTransactionAdminService;
use App\Services\Plan\PlanService;
use App\Services\PlanCheckout\PlanCheckoutService;
use Carbon\Carbon;
use DB;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Throwable;

class JobProcessPaymentPlan implements ShouldQueue
{
    use Queueable;

    protected $contentBank;
    protected $transactionId;
    protected $amount;
    protected ?Carbon $expireTimeByAdmin;
    protected $note;
    protected $checkoutId;
    
    public function __construct($contentBank = null, $transactionId = null, $amount = 0, ?Carbon $expireTimeByAdmin = null, $note = null, $checkoutId = null)
    {
        $this->contentBank = $contentBank;
        $this->transactionId = $transactionId;
        $this->amount = $amount;
        $this->expireTimeByAdmin = $expireTimeByAdmin;
        $this->note = $note;
        $this->checkoutId = $checkoutId;
        $this->queue = 'process_payment_plan';
    }

    public static function forBankTransaction(string $contentBank, string $transactionId, float $amount): self
    {
        return new self(
            contentBank: $contentBank,
            transactionId: $transactionId,
            amount: $amount
        );
    }

    public static function forAdminAddPlan(int $checkoutId, Carbon $expireTimeByAdmin, ?string $note = null, ?string $transactionId = null): self
    {
        $transactionId = $transactionId ?? Helpers::generateTransactionId('ADMIN_ADD_PLAN');
        return new self(
            expireTimeByAdmin: $expireTimeByAdmin,
            note: $note,
            checkoutId: $checkoutId,
            transactionId: $transactionId
        );
    }

    public static function forDefaultPlanNewUser(int $checkoutId): self
    {
        return new self(
            checkoutId: $checkoutId
        );
    }

    /**
     * Execute the job.
     */
    public function handle(
        PlanCheckoutService $planCheckoutService,
        PlanService $planService,
        UserService $userService,
        PaymentTransactionAdminService $paymentTransactionAdminService,
        CurrencyRateService $currencyRateService,
        ChargeService $chargeService
    ): void {
        echo "==========================================Start JobProcessPaymentPlan==========================================" . PHP_EOL;

        try {
            DB::beginTransaction();
            $planCheckout = null;

            if (!empty($this->contentBank)) {
                $planCheckout = $planCheckoutService->findPendingByContentBank($this->contentBank);
            } else if (!empty($this->checkoutId)) {
                $planCheckout = $planCheckoutService->findPendingById($this->checkoutId);
            }

            if (!$planCheckout) {
                $message = "Không tìm thấy thông tin checkout cho ";
                $message .= !empty($this->contentBank) ? "content_bank: " . $this->contentBank : "checkout_id: " . $this->checkoutId;
                echo $message . PHP_EOL;
                DB::commit();
                return;
            }

            $userId = $planCheckout->user_id;
            $user = $userService->findById($userId);
            if (!$user) {
                echo "Không tìm thấy user cần thanh toán gói" . PHP_EOL;
                echo "user_id: " . $userId . PHP_EOL;
                DB::commit();
                return;
            }

            $planId = $planCheckout->plan_id;
            $plan = $planService->getById($planId);
            if (!$plan) {
                echo "Không tìm thấy gói" . PHP_EOL;
                echo "plan_id: " . $planId . PHP_EOL;
                DB::commit();
                return;
            }
            
            $isAdminSetPlan = !empty($this->expireTimeByAdmin);
            $isNotDefaultPlan = $planCheckout->type != CheckOuts::TYPE['DEFAULT'];
            $isCreatedPaymentTransaction = false;

            if ($isNotDefaultPlan) {
                $paymentTransaction = $this->createPaymentTransaction($paymentTransactionAdminService, $currencyRateService, $userId, $planCheckout);
                $isCreatedPaymentTransaction = $paymentTransaction ? true : false;
            }

            if (!$isAdminSetPlan && $isNotDefaultPlan && $this->amount < $planCheckout->amount_vnd) {
                echo "Số tiền cần thanh toán không đủ" . PHP_EOL;
                echo "Số tiền đã thanh toán: " . $this->amount . " - Số tiền cần thanh toán: " . $planCheckout->amount_vnd . PHP_EOL;
                echo "content_bank: " . $this->contentBank . PHP_EOL;

                $paymentTransactionAdminService->update($paymentTransaction, [
                    'status' => PaymentTransactions::STATUS['REJECT'],
                    'system_note' => 'Số tiền thanh toán không đủ',
                ]);
                // $planCheckoutService->update($planCheckout, ['status' => CheckOuts::STATUS['REJECT']]);
                DB::commit();
                return;
            }

            $charge = $chargeService->makePlanCharge($planCheckout, $userId, $this->expireTimeByAdmin);

            if ($isNotDefaultPlan) {
                $paymentTransactionAdminService->update($paymentTransaction, [
                    'status' => PaymentTransactions::STATUS['COMPLETE'],
                    'active_plan_date' => Carbon::now(),
                    'charge_id' => $charge->id,
                ]);
            }

            $planCheckoutService->update($planCheckout, ['status' => CheckOuts::STATUS['COMPLETE']]);

            echo "Kích hoạt gói " . $planCheckout->name . " thành công cho user_id: " . $userId . PHP_EOL;
            echo "Số tiền đã thanh toán: " . $this->amount . " - Số tiền cần thanh toán: " . $planCheckout->amount_vnd . PHP_EOL;
            echo "content_bank: " . $this->contentBank . PHP_EOL;
            DB::commit();
        } catch (Throwable $th) {
            DB::rollBack();
            echo 'Lỗi JobProcessPaymentPlan: ' . $th->getMessage() . PHP_EOL;
            throw $th;
        } finally {
            if ($isCreatedPaymentTransaction && !$isAdminSetPlan) {
                $paymentTransactionAdminService->rememberPurchaseCache([
                    'user_id' => $userId,
                    'payment_transaction_id' => $paymentTransaction->id,
                ]);
            }
            echo "==========================================End JobProcessPaymentPlan==========================================" . PHP_EOL;
        }
    }

    public function createPaymentTransaction(PaymentTransactionAdminService $paymentTransactionAdminService, CurrencyRateService $currencyRateService, $userId, CheckOuts $planCheckout)
    {
        return $paymentTransactionAdminService->create([
            'user_id' => $userId,
            'check_out_id' => $planCheckout->id,
            'payment_method_id' => $planCheckout->payment_method_id,
            'amount' => $currencyRateService->convertVNDToUSD($this->amount),
            'amount_vnd' => $this->amount,
            'currency' => 'VND',
            'transaction_id' => $this->transactionId,
            'payment_date' => Carbon::now(),
            'creator_id' => $planCheckout->creator_id,
            'status' => PaymentTransactions::STATUS['PENDING'],
            'note' => $this->note,
        ]);
    }
}
