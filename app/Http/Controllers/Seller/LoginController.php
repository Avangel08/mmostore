<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\View;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{

    public function login(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function authenticate(LoginRequest $request): RedirectResponse
    {
        $request->authenticate(config('guard.seller'));
        $request->session()->regenerate();

		return redirect()->route('seller.dashboard');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard(config('guard.seller'))->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect()->route('seller.login');
    }

    /**
     * Magic login endpoint: accepts a signed URL and logs in the seller by id.
     */
    public function magicLogin(Request $request): RedirectResponse
    {
        $userId = (int) $request->query('user_id');
        if (!$userId) {
            return redirect()->route('seller.login');
        }

        $provider = Auth::guard(config('guard.seller'))->getProvider();
        $user = $provider ? $provider->retrieveById($userId) : null;

        if (!$user) {
            return redirect()->route('seller.login');
        }

        Auth::guard(config('guard.seller'))->login($user);
        $request->session()->regenerate();

		return redirect()->route('seller.dashboard');
    }
}


