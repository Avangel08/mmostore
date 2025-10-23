<?php

namespace App\Services\CurrencyRate;

use App\Models\MySQL\CurrencyRates;

/**
 * Class CurrencyRateService
 * @package App\Services
 */
class CurrencyRateService
{
    public function getPaginateData($request)
    {
        $page = $request['page'] ?? 1;
        $perPage = $request['perPage'] ?? 10;
        return CurrencyRates::filterRateRange($request)
            ->filterEffectiveDate($request)
            ->filterCreatedDate($request)
            ->orderBy('date', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function create($data)
    {
        return CurrencyRates::create($data);
    }

    public function currencyRateActive()
    {
        return CurrencyRates::orderBy("date", "desc")->where("status", CurrencyRates::STATUS["ACTIVE"])->first();
    }

    public function convertVNDToUSD(float $amount): float
    {
        $rate = $this->currencyRateActive();
        $result = 0;
        if (!empty($rate)) {
            $rateVND = $rate->to_vnd;
            $result = round($amount / $rateVND, 2);
        }
        return $result;
    }

    public function convertUSDToVND(float $amount): float
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
