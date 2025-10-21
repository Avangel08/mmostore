<?php
namespace App\Services\PlanCheckout;

use App\Helpers\Helpers;
use App\Models\MySQL\CheckOuts;
use App\Models\MySQL\PaymentMethods;
use App\Models\MySQL\Plans;
use App\Models\MySQL\User;
use App\Services\CheckBank\CheckBankService;

class PlanCheckoutService
{
    public function findById($id, $select = ["*"], $with = [])
    {
        return CheckOuts::where("id", $id)
            ->select($select)
            ->with($with)
            ->first();
    }

    public function createCheckout(User $user, Plans $plan, PaymentMethods $paymentMethod)
    {
        $currencyRateService = app(\App\Services\CurrencyRate\CurrencyRateService::class);
        $checkoutModel = CheckOuts::updateOrCreate([
            'user_id' => $user->id,
            'status' => CheckOuts::STATUS['PENDING']
        ], [
            'plan_id' => $plan->id,
            'payment_method_id' => $paymentMethod->id,
            'type' => $plan->type,
            'name' => $plan->name,
            'amount' => $currencyRateService->convertVNDToUSD($plan->price),
            'amount_vnd' => $plan->price,
            'interval' => $plan->interval,
            'interval_type' => $plan->interval_type,
            'status' => CheckOuts::STATUS['PENDING'],
            'creator_id' => $user->id,
            'content_bank' => CheckBankService::genContentBank($user->id, $paymentMethod->key)
        ]);
        if (!$checkoutModel) {
            return null;
        }
        $checkoutModel->update([
            'content_bank' => CheckBankService::genContentBank($user->id, $checkoutModel->id)
        ]);
        return $checkoutModel;
    }
}
