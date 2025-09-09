<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    private function detectRootView(Request $request): string
    {
        $host = $request->getHost();
        $path = '/'.ltrim($request->path(), '/');

        // Home root domain always uses home app (even if path contains /admin)
        if ($host === 'mmostore.local') {
            return 'app_home';
        }

        // Determine if this is a subdomain like {sub}.mmostore.local
        $isSubdomain = count(explode('.', $host)) > 2;

        // Admin area (seller): only for subdomains with /admin prefix
        if ($isSubdomain && str_starts_with($path, '/admin')) {
            return 'app_seller';
        }

        // Buyer: public subdomains by default
        return 'app_buyer';
    }

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $this->rootView = $this->detectRootView($request);
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
        ];
    }
}
