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
        $path = '/' . ltrim($request->path(), '/');

        if ($host === 'mmostore.local' && str_starts_with($path, '/admin')) {
            return 'app_admin';
        }

        if ($host === 'mmostore.local' && str_starts_with($path, '/demo')) {
            return 'app';
        }

        if ($host === 'mmostore.local') {
            return 'app_home';
        }

        $isSubdomain = count(explode('.', $host)) > 2;
        if ($isSubdomain && str_starts_with($path, '/admin')) {
            return 'app_seller';
        }

        if ($isSubdomain) {
            return 'app_buyer';
        }

        return 'app_home';
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
        
        // Extract subdomain from hostname
        $host = $request->getHost();
        $parts = explode('.', $host);
        $subdomain = count($parts) > 2 ? $parts[0] : null;
        
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'message' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
                'info' => fn() => $request->session()->get('info'),
            ],
        ];
    }
}
