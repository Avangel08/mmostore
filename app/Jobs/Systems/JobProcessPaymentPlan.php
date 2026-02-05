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
    protected $isShowEcho;

    public function __construct($contentBank = null, $transactionId = null, $amount = 0, ?Carbon $expireTimeByAdmin = null, $note = null, $checkoutId = null, bool $isShowEcho = false)
    {
        $this->contentBank = $contentBank;
        $this->transactionId = $transactionId;
        $this->amount = $amount;
        $this->expireTimeByAdmin = $expireTimeByAdmin;
        $this->note = $note;
        $this->checkoutId = $checkoutId;
        $this->isShowEcho = $isShowEcho;
        $this->queue = 'process_payment_plan';
    }

    public static function forBankTransaction(string $contentBank, string $transactionId, float $amount, bool $isShowEcho = true): self
    {
        return new self(
            contentBank: $contentBank,
            transactionId: $transactionId,
            amount: $amount,
            isShowEcho: $isShowEcho
        );
    }

    public static function forAdminAddPlan(int $checkoutId, Carbon $expireTimeByAdmin, ?string $note = null, ?string $transactionId = null, bool $isShowEcho = false): self
    {
        $transactionId = $transactionId ?? Helpers::generateTransactionId('ADMIN_ADD_PLAN');
        return new self(
            expireTimeByAdmin: $expireTimeByAdmin,
            note: $note,
            checkoutId: $checkoutId,
            transactionId: $transactionId,
            isShowEcho: $isShowEcho
        );
    }

    public static function forDefaultPlanNewUser(int $checkoutId, bool $isShowEcho = false): self
    {
        return new self(
            checkoutId: $checkoutId,
            isShowEcho: $isShowEcho
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
        $this->showEcho("==========================================Start JobProcessPaymentPlan==========================================");

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
                $this->showEcho($message);
                DB::commit();
                return;
            }

            $userId = $planCheckout->user_id;
            $user = $userService->findById($userId);
            if (!$user) {
                $this->showEcho("Không tìm thấy user cần thanh toán gói");
                $this->showEcho("user_id: " . $userId);
                DB::commit();
                return;
            }

            $planId = $planCheckout->plan_id;
            $plan = $planService->getById($planId);
            if (!$plan) {
                $this->showEcho("Không tìm thấy gói");
                $this->showEcho("plan_id: " . $planId);
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
                $this->showEcho("Số tiền cần thanh toán không đủ");
                $this->showEcho("Số tiền đã thanh toán: " . $this->amount . " - Số tiền cần thanh toán: " . $planCheckout->amount_vnd);
                $this->showEcho("content_bank: " . $this->contentBank);

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

            $this->showEcho("Kích hoạt gói " . $planCheckout->name . " thành công cho user_id: " . $userId);
            $this->showEcho("Người tạo: " . $user->name . " - " . $user->email);

            if ($this->contentBank && !$isAdminSetPlan) {
                $this->showEcho("Số tiền đã thanh toán: " . $this->amount . " - Số tiền cần thanh toán: " . $planCheckout->amount_vnd);
                $this->showEcho("content_bank: " . $this->contentBank);
            }
            DB::commit();
        } catch (Throwable $th) {
            DB::rollBack();
            $this->showEcho('Lỗi JobProcessPaymentPlan: ' . $th->getMessage());
            throw $th;
        } finally {
            if ($isCreatedPaymentTransaction && !$isAdminSetPlan) {
                $paymentTransactionAdminService->rememberPurchaseCache([
                    'user_id' => $userId,
                    'payment_transaction_id' => $paymentTransaction->id,
                ]);
            }
            $this->showEcho("==========================================End JobProcessPaymentPlan==========================================");
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

    public function showEcho($content)
    {
        if ($this->isShowEcho) {
            echo $content . PHP_EOL;
        }
    }
}
