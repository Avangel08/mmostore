<?php

namespace App\Providers;

use App\Models\MySQL\PersonalAccessToken;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\App;
use Laravel\Sanctum\Sanctum;

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
        Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);

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

        $theme = session('theme') ?? 'Theme_1';
        $subdomain = session('subdomain') ?? request()->getHost();
        $isAuthenticated = session('isAuthenticated') ?? auth()->user() !== null;
        $ownerStoreId = session('ownerStoreId') ?? null;

        Inertia::share([
            'theme' => $theme,
            'subdomain' => $subdomain,
            'isAuthenticated' => $isAuthenticated,
            'ownerStoreId' => $ownerStoreId,
        ]);
    }
}
