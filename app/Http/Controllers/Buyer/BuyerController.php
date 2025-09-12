<?php

namespace App\Http\Controllers\Buyer;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class BuyerController extends Controller
{
    public function home(string $sub): Response
    {
        $user = auth('buyer')->user();
        
        return Inertia::render('Home/Index', [
            'subdomain' => $sub,
            'user' => $user,
            'isAuthenticated' => $user !== null
        ]);
    }

    public function products(string $sub): Response
    {
        $user = auth('buyer')->user();
        
        return Inertia::render('Products/Index', [
            'subdomain' => $sub,
            'user' => $user,
            'isAuthenticated' => $user !== null
        ]);
    }

    public function productDetail(string $sub, string $id): Response
    {
        $user = auth('buyer')->user();
        
        return Inertia::render('Products/Detail', [
            'subdomain' => $sub,
            'productId' => $id,
            'user' => $user,
            'isAuthenticated' => $user !== null
        ]);
    }

    public function about(string $sub): Response
    {
        $user = auth('buyer')->user();
        
        return Inertia::render('About/Index', [
            'subdomain' => $sub,
            'user' => $user,
            'isAuthenticated' => $user !== null
        ]);
    }

    public function contact(string $sub): Response
    {
        $user = auth('buyer')->user();
        
        return Inertia::render('Contact/Index', [
            'subdomain' => $sub,
            'user' => $user,
            'isAuthenticated' => $user !== null
        ]);
    }
}


