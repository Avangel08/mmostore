<?php

namespace App\Http\Middleware;

use App\Models\MySQL\Stores;
use App\Models\Mongo\Customers;
use Closure;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ValidateBuyerToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (!$user) {
            throw new AuthenticationException();
        }

        if (!($user instanceof Customers)) {
            throw new AuthenticationException();
        }

        $host = $request->getHost();
        if (!$host) {
            throw new NotFoundHttpException('Domain not found');
        }

        $store = app('store') ?? Stores::whereJsonContains('domain', $host)->first();
        if (!$store) {
            throw new NotFoundHttpException('Store not found');
        }

        return $next($request);
    }
}


