<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Lang;

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
        Inertia::share([
            'locale' => fn () => App::getLocale(),
            'translations', function () {
                $locale = App::getLocale();
                $path = resource_path("lang/{$locale}.json");
                if (file_exists($path)) {
                    $json = file_get_contents($path);
                    return json_decode($json, true) ?? [];
                }
                return [];
            }
        ]);

        $this->app->useLangPath(resource_path('locales'));
    }
}
