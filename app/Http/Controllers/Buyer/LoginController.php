<?php

namespace App\Http\Controllers\Buyer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    /**
     * Display the login view.
     */
    public function show(): Response
    {
        return Inertia::render('Auth/Login');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function authenticate(LoginRequest $request): RedirectResponse
    {
        $request->authenticate(config('guard.buyer'));
        $request->session()->regenerate();
        
        return redirect()->route('buyer.home');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard(config('guard.buyer'))->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect()->route('buyer.home');
    }
}
