<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminSubdomainMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $isAuthenticated = auth()->check();
        $path = ltrim($request->path(), '/');

        // Allow login page for guests
        if (!$isAuthenticated && (str_starts_with($path, 'admin/login') || $path === 'admin/login')) {
            return $next($request);
        }

        // Allow dashboard and other admin pages for authenticated users
        if ($isAuthenticated && (str_starts_with($path, 'admin/dashboard') || $path === 'admin/dashboard')) {
            return $next($request);
        }

        // Base /admin should redirect based on auth state
        if ($path === 'admin' || $path === 'admin/') {
            return $isAuthenticated
                ? redirect('/admin/dashboard')
                : redirect('/admin/login');
        }

        // If unauthenticated and accessing any other admin page, redirect to login
        if (!$isAuthenticated && str_starts_with($path, 'admin')) {
            return redirect('/admin/login');
        }

        // If authenticated and accessing non-dashboard admin page, allow through
        return $next($request);
    }
}


