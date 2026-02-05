<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PublicSubdomainMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Always redirect public subdomain requests to root '/'
        $path = $request->path();
        if ($path !== '/') {
            return redirect('/');
        }

        return $next($request);
    }
}


