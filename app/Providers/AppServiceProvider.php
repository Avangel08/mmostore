<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (config('app.env') === 'production') {
            URL::forceScheme('https');
            // Ensure absolute URLs (including assets) use HTTPS and the current host
            $host = request()->getHost();
            if (!empty($host)) {
                URL::forceRootUrl('https://' . $host);
            }
        }
        Inertia::share('translations', function () {
            $locale = App::getLocale();
            $path = resource_path("lang/{$locale}.json");
            if (file_exists($path)) {
                $json = file_get_contents($path);
                return json_decode($json, true) ?? [];
            }
            return [];
        });
    }
}
