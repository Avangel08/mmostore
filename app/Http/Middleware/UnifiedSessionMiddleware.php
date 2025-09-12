<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Session\Middleware\StartSession;
use Symfony\Component\HttpFoundation\Response;

class UnifiedSessionMiddleware extends StartSession
{
    /**
     * Get the session configuration based on the guard type.
     */
    protected function getSessionConfig(string $guardType): array
    {
        $config = config('session');
        
        $cookieSuffix = match($guardType) {
            'admin' => '_admin',
            'seller' => '_seller', 
            'buyer' => '_buyer',
            default => ''
        };
        
        $config['cookie'] = $config['cookie'] . $cookieSuffix;
        
        return $config;
    }

    /**
     * Determine the guard type from the request.
     */
    protected function getGuardType(Request $request): string
    {
        $host = $request->getHost();
        $path = ltrim($request->path(), '/');

        $parts = explode('.', $host);
        $hasSubdomain = count($parts) > 2;
        $subdomain = $hasSubdomain ? $parts[0] : null;

        $firstSegment = $path === '' ? '' : explode('/', $path)[0];

        if ($firstSegment === 'admin') {
            return $hasSubdomain ? 'seller' : 'admin';
        }

        return 'buyer';
    }

    /**
     * Handle an incoming request.
     */
    public function handle($request, Closure $next): Response
    {
        $guardType = $this->getGuardType($request);
        
        $originalConfig = config('session');
        $guardConfig = $this->getSessionConfig($guardType);
        
        config(['session' => array_merge($originalConfig, $guardConfig)]);
        
        $response = parent::handle($request, $next);
        
        config(['session' => $originalConfig]);
        
        return $response;
    }
}
