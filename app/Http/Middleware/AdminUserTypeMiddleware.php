<?php

namespace App\Http\Middleware;

use App\Models\MySQL\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminUserTypeMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::guard('admin')->user();
        
        if (!$user) {
            return $next($request);
        }
        
        if ($user->type !== User::TYPE['ADMIN']) {
            Auth::guard('admin')->logout();
            
            return redirect()->route('admin.login')->withErrors([
                'email' => 'Access denied. Only administrators can access this area.',
            ]);
        }
        
        return $next($request);
    }
}
