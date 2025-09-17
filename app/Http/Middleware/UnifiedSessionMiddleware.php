<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Session\Middleware\StartSession;
use Symfony\Component\HttpFoundation\Response;
use App\Helpers\AuthHelper;

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
     * Handle an incoming request.
     */
    public function handle($request, Closure $next): Response
    {
        $guardType = AuthHelper::getGuardType($request);

        $originalConfig = config('session');
        $guardConfig = $this->getSessionConfig($guardType);

        config(['session' => array_merge($originalConfig, $guardConfig)]);

        $response = parent::handle($request, $next);

        config(['session' => $originalConfig]);

        return $response;
    }
}
