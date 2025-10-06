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
}
