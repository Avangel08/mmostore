<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\View;

class SellerController extends Controller
{
    public function home(string $sub)
    {
        if (View::exists('welcome')) {
            return view('welcome', ['subdomain' => $sub, 'section' => 'admin']);
        }
        return 'MMO Store - Admin for subdomain: ' . $sub;
    }

    public function login()
    {
        return 'MMO Store - Admin';
    }

    public function dashboard()
    {
        return 'Admin Dashboard Page';
    }
}


