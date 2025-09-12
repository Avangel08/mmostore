<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Auth;

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
            return Auth::guard('seller')->user();
        } elseif ($route && str_contains($route->getName(), 'buyer')) {
            return Auth::guard('buyer')->user();
        }
        
        return Auth::user();
    }
    
    /**
     * Kiểm tra user có đang login theo context không
     */
    public static function isAuthenticated($context = null)
    {
        if ($context) {
            return Auth::guard($context)->check();
        }
        
        $route = request()->route();

        if ($route && str_contains($route->getName(), 'admin')) {
            return Auth::guard('admin')->check();
        } elseif ($route && str_contains($route->getName(), 'seller')) {
            return Auth::guard('seller')->check();
        } elseif ($route && str_contains($route->getName(), 'buyer')) {
            return Auth::guard('buyer')->check();
        }
        
        return Auth::check();
    }
    
    /**
     * Lấy context hiện tại dựa trên route
     */
    public static function getCurrentContext()
    {
        $route = request()->route();

        if ($route && str_contains($route->getName(), 'admin')) {
            return 'admin';
        } elseif ($route && str_contains($route->getName(), 'seller')) {
            return 'seller';
        } elseif ($route && str_contains($route->getName(), 'buyer')) {
            return 'buyer';
        }
        
        return 'web';
    }
}
