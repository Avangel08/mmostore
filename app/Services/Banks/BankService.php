<?php

namespace App\Services\Banks;

use App\Models\MySQL\Banks;

/**
 * Class BankService
 * @package App\Services
 */
class BankService
{
    public function findByShortName($shortName)
    {
        return Banks::where('short_name', $shortName)->first();
    }

    public function findByCode($code)
    {
        return Banks::where('code', $code)->first();
    }

    public function getListForSePay()
    {
        return Banks::where('supported', true)->get();
    }
}
