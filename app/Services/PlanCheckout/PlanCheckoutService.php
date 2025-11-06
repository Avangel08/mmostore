<?php
namespace App\Services\PlanCheckout;

use App\Helpers\Helpers;
use App\Models\MySQL\CheckOuts;
use App\Models\MySQL\PaymentMethods;
use App\Models\MySQL\Plans;
use App\Models\MySQL\User;
use App\Services\CheckBank\CheckBankService;
use Auth;

class PlanCheckoutService
{
    public function findById($id, $select = ["*"], $with = [])
    {
        return CheckOuts::where("id", $id)
            ->select($select)
            ->with($with)
            ->first();
    }

    public function update(CheckOuts $checkoutItem, $data)
    {
        return $checkoutItem->update($data);
    }

    public function findPendingByContentBank($contentBank, $select = ["*"], $with = [])
    {
        return CheckOuts::where('content_bank', $contentBank)->where('status', CheckOuts::STATUS['PENDING'])->select($select)->with($with)->first();
    }

    public function findPendingById($id, $select = ["*"], $with = [])
    {
        return CheckOuts::where('id', $id)->where('status', CheckOuts::STATUS['PENDING'])->select($select)->with($with)->first();
    }

    public function findExist($data)
    {
        return CheckOuts::where('user_id', $data['user_id'])
            ->where('plan_id', $data['plan_id'])
            ->where('payment_method_id', $data['payment_method_id'])
            ->where('amount', $data['amount'])
            ->where('amount_vnd', $data['amount_vnd'])
            ->where('status', $data['status'])
            ->first();
    }

    public function createCheckout(User $user, Plans $plan, PaymentMethods $paymentMethod, bool $isAdminCreate = false)
    {
        $currencyRateService = app(\App\Services\CurrencyRate\CurrencyRateService::class);
        $dataInsert = [
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'payment_method_id' => $paymentMethod->id,
            'type' => $plan->type,
            'name' => $plan->name,
            'amount' => $currencyRateService->convertVNDToUSD($plan->price),
            'amount_vnd' => $plan->price,
            'interval' => $plan->interval,
            'interval_type' => $plan->interval_type,
            'description' => $plan->description,
            'status' => CheckOuts::STATUS['PENDING'],
            'creator_id' => $isAdminCreate ? Auth::guard(config('guard.admin'))->id() : $user->id,
            'content_bank' => null,
        ];

        $checkout = $this->findExist($dataInsert);

        if (!$checkout) {
            $checkout = CheckOuts::create($dataInsert);
        }

        if (!$isAdminCreate) {
            $checkout->update(['content_bank' => CheckBankService::genContentBank($user->id, $checkout->id, $paymentMethod->key, 8)]);
        }

        return $checkout;
    }
}
