<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class SetRouteSubdomain
{
    /**
     * Set default route parameters for the current subdomain.
     */
    public function handle(Request $request, Closure $next)
    {
        $host = $request->getHost();
        $parts = explode('.', $host);
        $subdomain = count($parts) > 2 ? $parts[0] : null;

        if ($subdomain) {
            URL::defaults(['sub' => $subdomain]);
        }

        return $next($request);
    }
}


