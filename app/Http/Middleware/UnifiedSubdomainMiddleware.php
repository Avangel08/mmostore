<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UnifiedSubdomainMiddleware
{
    /**
     * Determine the guard type from the request.
     */
    protected function getGuardType(Request $request): string
    {
        $host = $request->getHost();
        $path = ltrim($request->path(), '/');

        $parts = explode('.', $host);
        $hasSubdomain = count($parts) > 2;

        $firstSegment = $path === '' ? '' : explode('/', $path)[0];

        if ($firstSegment === 'admin') {
            return $hasSubdomain ? 'seller' : 'admin';
        }

        return 'buyer';
    }

    /**
     * Get public routes for each guard type.
     */
    protected function getPublicRoutes(string $guardType): array
    {
        return match($guardType) {
            'admin' => ['admin/login', 'admin/register', 'admin/forgot-password', 'admin/reset-password'],
            'seller' => ['login', 'login/'],
            'buyer' => ['', '/', 'products', 'product', 'about', 'contact', 'login', 'register'],
            default => []
        };
    }

    /**
     * Check if current path is public.
     */
    protected function isPublicRoute(Request $request, string $guardType): bool
    {
        $path = ltrim($request->path(), '/');
        $publicRoutes = $this->getPublicRoutes($guardType);

        foreach ($publicRoutes as $route) {
            $cleanRoute = rtrim($route, '/');
            $cleanPath = rtrim($path, '/');
            
            if ($cleanRoute === '' || $cleanRoute === '/') {
                if ($cleanPath === '' || $cleanPath === '/') {
                    return true;
                }
            } elseif ($cleanPath === $cleanRoute || str_starts_with($cleanPath, $cleanRoute . '/')) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get login route for each guard type.
     */
    protected function getLoginRoute(Request $request, string $guardType): string
    {
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
    public function handle(Request $request, Closure $next): Response
    {
        $guardType = $this->getGuardType($request);
        $isAuthenticated = auth(config("guard.{$guardType}"))->check();
        $isPublicRoute = $this->isPublicRoute($request, $guardType);

        if ($isPublicRoute) {
            return $next($request);
        }

        if (!$isAuthenticated) {
            $loginRoute = $this->getLoginRoute($request, $guardType);
            return redirect($loginRoute);
        }

        return $next($request);
    }
}
