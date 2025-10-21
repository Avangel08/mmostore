<?php

namespace App\Services\CurrencyRateSeller;

use App\Models\Mongo\CurrencyRateSeller;

/**
 * Class CurrencyRateSellerService
 * @package App\Services
 */
class CurrencyRateSellerService
{
    public function create($data)
    {
        return CurrencyRateSeller::create($data);
    }

    public function currencyRateActive()
    {
        return CurrencyRateSeller::orderBy("date", "desc")->where("status", CurrencyRateSeller::STATUS["ACTIVE"])->first();
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

    public function getForTable($request){
        $page = $request['page'] ?? 1;
        $perPage = $request['perPage'] ?? 10;
        return CurrencyRateSeller::filterSearch($request)
            ->filterDateRange($request)
            ->orderBy('date', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
    }
}
