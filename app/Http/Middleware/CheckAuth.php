<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class CheckAuth
{
    /**
     * Handle an incoming request.
     */
    public function handle($request, Closure $next, $guard, $redirectRoute = null)
    {
        if (!Auth::guard($guard)->check()) {
            switch ($guard) {
                case 'buyer':
                    return redirect()->route($redirectRoute ?? 'buyer.home');
                case 'admin':
                    return redirect()->route($redirectRoute ?? 'admin.login');
                case 'seller':
                    return redirect()->route($redirectRoute ?? 'seller.login', [
                        'shop' => $request->route('shop')
                    ]);
                default:
                    return redirect()->route($redirectRoute ?? 'login');
            }
        }

        return $next($request);
    }
}
