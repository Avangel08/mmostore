<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class AuthHelper
{
    /**
     * Lấy user hiện tại theo context
     */
    public static function getCurrentUser($context = null)
    {
        if ($context) {
            return Auth::guard($context)->user();
        }
        
        $route = request()->route();

        if ($route && str_contains($route->getName(), 'admin')) {
            return Auth::guard('admin')->user();
        } elseif ($route && str_contains($route->getName(), 'seller')) {
            return Auth::guard('seller')->user()?->load(['currentPlan']);
        } elseif ($route && str_contains($route->getName(), 'buyer')) {
            return Auth::guard('buyer')->user();
        }
        
        return Auth::user();
    }
}
