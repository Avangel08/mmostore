<?php

namespace App\Services\Charge;

use App\Models\MySQL\Charges;

/**
 * Class ChargeService
 * @package App\Services
 */
class ChargeService
{
    public function create($data)
    {
        return Charges::create($data);
    }

    public function getCurrentChargeByUser($userId)
    {
        return Charges::where('user_id', $userId)
            ->orderByDesc('created_at')
            ->first();
    }

    public function extendExpiresOn(Charges $charge, $newExpiresOn)
    {
        $charge->expires_on = $newExpiresOn;
        $charge->save();

        return $charge;
    }
}
