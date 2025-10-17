<?php

namespace App\Services\SePay;

use Illuminate\Http\Request;

/**
 * Class SePayService
 * @package App\Services
 */
class SePayService
{
    public function bearerToken(Request $request)
    {
        $header = $request->header('Authorization', '');

        $position = strrpos($header, 'Apikey ');

        if ($position !== false) {
            $header = substr($header, $position + 7);

            return str_contains($header, ',') ? (strstr($header, ',', true) ?: null) : $header;
        }

        return null;
    }
}
