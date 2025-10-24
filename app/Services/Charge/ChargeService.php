<?php

namespace App\Services\Charge;

use App\Models\MySQL\Charges;
use App\Models\MySQL\CheckOuts;
use Carbon\Carbon;

/**
 * Class ChargeService
 * @package App\Services
 */
class ChargeService
{
    public function getCurrentChargeByUser($userId)
    {
        return Charges::where('user_id', $userId)
            ->orderByDesc('created_at')
            ->first();
    }

    public function makePlanCharge(CheckOuts $planCheckout, $userId)
    {
        return Charges::create([
            'user_id' => $userId,
            'type' => $planCheckout->type,
            'name' => $planCheckout->name,
            'interval' => $planCheckout->interval,
            'interval_type' => $planCheckout->interval_type,
            'description' => $planCheckout->description,
            'feature' => $planCheckout->feature,
            'active_on' => Carbon::now(),
            'expires_on' => $this->getDatetimeExpiresCharge($planCheckout, $userId),
            'check_out_id' => $planCheckout->id,
            'creator_id' => $planCheckout->creator_id,
        ]);
    }

    public function getDatetimeExpiresCharge(CheckOuts $planCheckout, $userId)
    {
        $currentCharge = $this->getCurrentChargeByUser($userId);
        if (empty($currentCharge?->expires_on)) {
            return Carbon::now()->addDays($planCheckout->interval);
        }

        $expiresOn = Carbon::createFromFormat('Y-m-d H:i:s', $currentCharge->expires_on);
        $isExpired = $expiresOn->isPast();

        if ($isExpired) {
            return Carbon::now()->addDays($planCheckout->interval);
        }
        
        return $expiresOn->addDays($planCheckout->interval);
    }
}
