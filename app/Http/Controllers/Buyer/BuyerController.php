<?php

namespace App\Http\Controllers\Buyer;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\View;

class BuyerController extends Controller
{
    public function home(string $sub)
    {
        return 'MMO Store - Subdomain: ' . $sub;
    }
}


