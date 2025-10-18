<?php

namespace App\Services\SePay;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

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

    public function getListTransaction($apiKey)
    {
        try {
            $url = "https://my.sepay.vn/userapi/transactions/list";

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
            ])->get($url);

            if($response->successful()){
                return $response->body();
            }
            return null;
        } catch (\Throwable $th) {
            \Log::error('SePayService getListTransaction error: ' . $th->getMessage());
            return null;
        }
    }
}
