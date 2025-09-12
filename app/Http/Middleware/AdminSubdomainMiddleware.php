<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminSubdomainMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $isAuthenticated = auth('admin')->check();
        $path = ltrim($request->path(), '/');

        if (!$isAuthenticated && (str_starts_with($path, 'admin/login') || $path === 'admin/login')) {
            return $next($request);
        }

        if ($isAuthenticated && (str_starts_with($path, 'admin/dashboard') || $path === 'admin/dashboard')) {
            return $next($request);
        }

        if ($path === 'admin' || $path === 'admin/') {
            return $isAuthenticated
                ? redirect('/admin/dashboard')
                : redirect('/admin/login');
        }

        if (!$isAuthenticated && str_starts_with($path, 'admin')) {
            return redirect('/admin/login');
        }

        return $next($request);
    }
}


