<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\View;
use Inertia\Inertia;
use Inertia\Response;

class DashBoardController extends Controller
{
    public function index(string $sub)
    {
        $guard = config('guard.seller');
        $user = Auth::guard($guard)->user();
        
        return Inertia::render('Dashboard/index', [
            'user' => $user,
            'subdomain' => $sub
        ]);
    }
}


