<?php

namespace App\Http\Middleware;

use App\Helpers\AuthHelper;
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
        $domain = [
            'mmostore.local',
            'mmostores.shop',
            'mmoshop.io',
        ];

        $host = $request->getHost();
        $path = '/' . ltrim($request->path(), '/');

        if (in_array($host, $domain) && str_starts_with($path, '/admin')) {
            return 'app_admin';
        }

        if (in_array($host, $domain) && str_starts_with($path, '/demo')) {
            return 'app';
        }

        if (in_array($host, $domain)) {
            return 'app_home';
        }

        $isSubdomain = count(explode('.', $host)) > 2;
        $mainDomain = config('app.main_domain');
        $isCustomDomain = !str_ends_with($host, '.' . $mainDomain) && !in_array($host, $domain);
        
        if (($isSubdomain || $isCustomDomain) && str_starts_with($path, '/admin')) {
            return 'app_seller';
        }

        if ($isSubdomain || $isCustomDomain) {
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

        $host = $request->getHost();
        $mainDomain = config('app.main_domain');
        $parts = explode('.', $host);
        $subdomain = count($parts) > 2 ? $parts[0] : null;
        
        $domainType = 'main';
        if ($host !== $mainDomain) {
            if (str_ends_with($host, '.' . $mainDomain)) {
                $domainType = 'subdomain';
            } else {
                $domainType = 'custom';
            }
        }
        
        return [
            ...parent::share($request),
            'auth' => [
                'user' => AuthHelper::getCurrentUser(),
            ],
            'subdomain' => $subdomain,
            'domainType' => $domainType,
            'currentDomain' => $host,
            'mainDomain' => $mainDomain,
            'message' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
                'info' => fn() => $request->session()->get('info'),
                'popup' => fn() => $request->session()->get('popup'),
            ],
            "storageUrl" => request()->getSchemeAndHttpHost() . '/storage',
        ];
    }
}
