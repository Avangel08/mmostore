<?php

namespace App\Services\CurrencyRate;

use App\Models\Mysql\CurrencyRates;

/**
 * Class CurrencyRateService
 * @package App\Services
 */
class CurrencyRateService
{
    public function currencyRateActive()
    {
        return CurrencyRates::orderBy("date", "desc")->first();
    }

    public function convertVNDToUSD(float $amount)  : float
    {
        $rate = $this->currencyRateActive();
        $result = 0;
        if (!empty($rate)) {
            $rateVND = $rate->to_vnd;
            $result = round($amount / $rateVND, 2);
        }
        return $result;
    }

    public function convertUSDToVND(float $amount) : float
    {
        $rate = $this->currencyRateActive();
        $result = 0;
        if (!empty($rate)) {
            $rateVND = $rate->to_vnd;
            $result = round($amount * $rateVND, 0);
        }
        return $result;
    }
}
