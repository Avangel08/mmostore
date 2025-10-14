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
        $request->session()->flash('popup', $user->id);

        return redirect()->intended(RouteServiceProvider::getRedirectAfterAuthenticated());
    }

    public function goToStore($id)
    {
        $user = $this->userService->findById($id);
        if (!$user) {
            return back()->with('error', 'User not found');
        }

        $store = $this->storeService->findByUserId($user->id);
        if (!$store || empty($store->domain) || !is_array($store->domain)) {
            return back()->with('error', 'Store domain not found for this user');
        }

        $domains = is_array($store->domain) ? $store->domain : [(string) $store->domain];
        $mainDomain = (string) config('app.main_domain');
        $host = collect($domains)->first(function ($d) use ($mainDomain) {
            return is_string($d) && $mainDomain !== '' && str_ends_with($d, '.' . $mainDomain);
        }) ?? $domains[0];

        $hostParts = explode('.', (string) $host);
        $sub = $hostParts[0] ?? null;
        if (!$sub) {
            return back()->with('error', 'Invalid store domain');
        }

        $signedUrl = URL::temporarySignedRoute(
            'seller.magic-login',
            now()->addMinutes(2),
            [
                'sub' => $sub,
                'user_id' => $user->id,
            ]
        );

        return Redirect::away($signedUrl);
    }
}
