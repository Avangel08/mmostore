<?php

namespace App\Helpers;

use App\Models\Mongo\Customers;
use Illuminate\Support\Carbon;

class Helpers
{
    public static function genIdentifier($length = 5)
    {
        $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        do {
            $randomString = '';
            for ($i = 0; $i < $length; $i++) {
                $randomString .= $characters[random_int(0, strlen($characters) - 1)];
            }
            $exists = Customers::where('identifier', $randomString)->exists();
        } while ($exists);

        return $randomString;
    }

    public static function genContentBank(int $userId, string $id, int $length = 6): string
    {
        $hash = hash('sha256', $id, true); // 32 bytes nhị phân, luôn ổn định theo $id
        $code = '';
        for ($i = 0; strlen($code) < $length && $i < strlen($hash); $i++) {
            $code .= chr(ord('A') + (ord($hash[$i]) % 26));
        }
        return "QR{$userId}{$code}";
    }
}
