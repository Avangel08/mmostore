<?php

namespace App\Jobs\Systems;

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
    /**
     * Create a new job instance.
     */
    public function __construct($contentBank, $transactionId, $amount, ?Carbon $expireTimeByAdmin = null, $note = null)
    {
        $this->contentBank = $contentBank;
        $this->transactionId = $transactionId;
        $this->amount = $amount;
        $this->expireTimeByAdmin = $expireTimeByAdmin;
        $this->note = $note;
        $this->queue = 'process_payment_plan';
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

        if ($this->expireTimeByAdmin) {
            echo "Admin thêm gói cho user" . PHP_EOL;
        }

        $isCreatedPaymentTransaction = false;

        try {
            DB::beginTransaction();
            $planCheckout = $planCheckoutService->findByContentBank($this->contentBank);

            if (!$planCheckout) {
                echo "Không tìm thấy thông tin checkout" . PHP_EOL;
                echo "content_bank: " . $this->contentBank . PHP_EOL;
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

            $paymentTransaction = $paymentTransactionAdminService->create([
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

            $isCreatedPaymentTransaction = $paymentTransaction ? true : false;

            if (empty($this->expireTimeByAdmin) && $this->amount < $planCheckout->amount_vnd) {
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
            $paymentTransactionAdminService->update($paymentTransaction, [
                'status' => PaymentTransactions::STATUS['COMPLETE'],
                'active_plan_date' => Carbon::now(),
                'charge_id' => $charge->id,
            ]);

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
            if ($isCreatedPaymentTransaction && empty($this->expireTimeByAdmin)) {
                $paymentTransactionAdminService->rememberPurchaseCache([
                    'user_id' => $userId,
                    'payment_transaction_id' => $paymentTransaction->id,
                ]);
            }
            echo "==========================================End JobProcessPaymentPlan==========================================" . PHP_EOL;
        }
    }
}
