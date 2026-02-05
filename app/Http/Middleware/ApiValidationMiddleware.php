<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiValidationMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $providedKey = $request->header('X-Api-Key');
        $expectedKey = config('services.api.key');

        if (!$expectedKey || $providedKey !== $expectedKey) {
            return response()->json([
                'message' => 'Invalid API key.'
            ], 401);
        }

        return $next($request);
    }
}


