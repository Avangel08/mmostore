<?php

namespace App\Helpers;

use Illuminate\Support\Carbon;

class Helpers
{   
    public static function genIdentifier($length = 5)
    {
        // Get current timestamp microseconds
        $timestamp = Carbon::now()->format("Uu");
        $shuffled = substr($timestamp, -$length);
        return $shuffled;
    }
}
