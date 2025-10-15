<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    public const HOME = '/dashboard';

    public static function getRedirectAfterAuthenticated(): string
    {
        foreach(config('auth.guards') as $guardName => $guardConfig) {
            if (auth()->guard($guardName)->check()) {
                $user = auth()->guard($guardName)->user();

                if ($user?->hasRole(config('role.admin'))) {
                    return '/admin';
                }
            }
        }

        return '/';
    }

    public function boot(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        $mainDomain = config('app.main_domain');

        $this->routes(function () use ($mainDomain){
            Route::domain('{sub}.' . $mainDomain)->middleware('api')->prefix('api')->group(base_path('routes/api.php'));
//            Route::middleware('web')->prefix('demo')->group(base_path('routes/web.php'));
            Route::domain($mainDomain)->middleware('web')->group(base_path('routes/home.php'));
            Route::domain($mainDomain)->middleware('web')->prefix('admin')->group(base_path('routes/admin.php'));
            Route::middleware('web')->group(base_path('routes/buyer.php'));
            Route::middleware('web')->group(base_path('routes/seller.php'));
        });
    }
}
