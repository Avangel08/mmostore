<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Symfony\Component\HttpFoundation\Response;
use App\Helpers\AuthHelper;

class UnifiedAuthMiddleware extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        if ($request->expectsJson()) {
            return null;
        }

        $guardType = AuthHelper::getGuardType($request);
        
        return match($guardType) {
            'admin' => route('admin.login'),
            'seller' => $this->getSellerLoginRoute($request),
            'buyer' => $this->getBuyerLoginRoute($request),
            default => route('buyer.login')
        };
    }

    /**
     * Get seller login route with subdomain.
     */
    protected function getSellerLoginRoute(Request $request): string
    {
        $host = $request->getHost();
        $parts = explode('.', $host);
        $subdomain = count($parts) > 2 ? $parts[0] : null;

        if ($subdomain) {
            return route('seller.login', ['sub' => $subdomain]);
        }

        return route('seller.login');
    }

    /**
     * Get buyer login route with subdomain.
     */
    protected function getBuyerLoginRoute(Request $request): string
    {
        $host = $request->getHost();
        $parts = explode('.', $host);
        $subdomain = count($parts) > 2 ? $parts[0] : null;

        if ($subdomain) {
            return route('buyer.login', ['sub' => $subdomain]);
        }

        return route('buyer.login');
    }

    /**
     * Handle an incoming request.
     */
    public function handle($request, Closure $next, ...$guards): Response
    {
        $guardType = AuthHelper::getGuardType($request);
        $guard = config("guard.{$guardType}");
        $this->authenticate($request, [$guard, ...$guards]);

        return $next($request);
    }
}
