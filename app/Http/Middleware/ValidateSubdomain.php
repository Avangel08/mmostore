<?php

namespace App\Http\Middleware;

use App\Models\MySQL\Stores;
use Closure;
use Illuminate\Http\Request;

class ValidateSubdomain
{
    /**
     * Validate if the subdomain exists in the stores table.
     */
    public function handle(Request $request, Closure $next)
    {
        $host = $request->getHost();
        
        if (!$host) {
            abort(404, 'Domain not found');
        }

        $store = Stores::where('status', Stores::STATUS['ACTIVE'])
            ->whereJsonContains('domain', $host)
            ->first();

        if (!$store) {
            abort(404, 'Store not found');
        }

        $request->merge(['current_store' => $store]);

        return $next($request);
    }
}
