<?php

namespace App\Http\Controllers\Home\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Home\Login\LoginRequest;
use App\Providers\RouteServiceProvider;
use App\Services\Home\StoreService;
use App\Services\Home\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class AuthenticatedSessionController extends Controller
{
    protected $userService;
    protected $storeService;
    public function __construct(
        UserService $userService,
        StoreService $storeService,
    ) {
        $this->userService = $userService;
        $this->storeService = $storeService;
    }

    public function index()
    {
        return Inertia::render('Login/index');
    }
    public function login(LoginRequest $request)
    {
        $request->authenticate();
        $request->session()->regenerate();

        $user = Auth::guard('seller')->user();
        // Lưu message vào session trước khi redirect
        $request->session()->flash('success', 'Đăng nhập thành công!');

        // Generate one-time popup token and store in cache (short TTL)
        $popupToken = Str::random(40);
        $cacheKey = "popup_login_token:{$user->id}:{$popupToken}";
        Cache::put($cacheKey, true, now()->addMinutes(5));

        $request->session()->flash('popup', [
            'user_id' => (string) $user->id,
            'token' => $popupToken,
            'expires_at' => now()->addMinutes(5)->toISOString(),
        ]);

        return redirect()->intended(RouteServiceProvider::getRedirectAfterAuthenticated());
    }

    public function goToStore(Request $request, $id)
    {
        // Validate popup token
        $token = (string) $request->input('token', '');
        if ($token === '') {
            return back()->with('error', 'Missing token');
        }

        $cacheKey = "popup_login_token:{$id}:{$token}";
        // Use pull to make token one-time
        $valid = Cache::pull($cacheKey);
        if (!$valid) {
            return back()->with('error', 'Invalid or expired token');
        }

        $user = $this->userService->findById($id);
        if (!$user) {
            return back()->with('error', 'User not found');
        }

        $store = $this->storeService->findByUserId($user->id);

        if (!$store || empty($store->domain) || !is_array($store->domain)) {
            return back()->with('error', 'Store domain not found for this user');
        }

        $domains = is_array($store->domain) ? $store->domain : [(string)$store->domain];
        $mainDomain = (string) config('app.main_domain');

        $host = collect($domains)->first(function ($d) use ($mainDomain) {
            return is_string($d) && $mainDomain !== '' && str_ends_with($d, '.' . $mainDomain);
        }) ?? $domains[0];

        $hostParts = explode('.', (string) $host);
        $sub = $hostParts[0] ?? null;

        if (!$sub) {
            return back()->with('error', 'Invalid store domain');
        }

        $scheme = request()->isSecure() ? 'https' : 'http';
        $tenantRoot = $scheme . '://' . $sub . '.' . $mainDomain;

        try {
            URL::forceRootUrl($tenantRoot);
            URL::forceScheme($scheme);

            $signedUrl = URL::temporarySignedRoute(
                'seller.magic-login',
                now()->addMinutes(2),
                [
                    'user_id' => $user->id,
                ]
            );
        } finally {
            URL::forceRootUrl(null);
        }

        return Redirect::away($signedUrl);
    }
}
