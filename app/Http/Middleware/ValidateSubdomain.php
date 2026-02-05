<?php

namespace App\Http\Middleware;

use App\Models\MySQL\Stores;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class ValidateSubdomain
{
    public function handle(Request $request, Closure $next)
    {
        $host = $request->getHost();
        $mainDomain = config('app.main_domain');
        $path = $request->path();
        
        if ($host === $mainDomain && str_starts_with($path, 'admin')) {
            return $next($request);
        }
        
        if (!$host) {
            abort(404, 'Domain not found');
        }

        $store = Stores::where('status', Stores::STATUS['ACTIVE'])
            ->where(function ($query) use ($host) {
                $query->whereJsonContains('domain', $host)
                    ->orWhere('domain', 'like', '%"' . $host . '"%');
            })
            ->first();

        if (!$store) {
            abort(404, 'Store not found');
        }

        app()->instance('store', $store);

        return $next($request);
    }
}
