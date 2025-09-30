<?php

namespace App\Http\Controllers\Buyer\Auth;

use App\Helpers\Helpers;
use App\Http\Controllers\Controller;
use App\Models\Mongo\Customers;
use App\Services\Customer\CustomerService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    protected $customerService;
    public function __construct(CustomerService $customerService)
    {
        $this->customerService = $customerService;
    }
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.Customers::class,
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $identifier = Helpers::genIdentifier(8);
        $retryCount = 0;
        $maxRetries = 10;
        while($retryCount++ < $maxRetries) {
            $existingUser = $this->customerService->findByIdentifier($identifier);
            if (!$existingUser) {
                break;
            }
        }
        if ($retryCount >= $maxRetries) {
            return back()->withErrors(['identifier' => 'Could not generate unique identifier, please try again.']);
        }

        $user = Customers::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'name' => $request->first_name . ($request?->last_name ?? ''),
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'status' => (int) Customers::STATUS['ACTIVE'],
            'identifier' => (string) $identifier,
        ]);

        event(new Registered($user));

        Auth::guard(config('guard.buyer'))->login($user);

        return redirect()->route('buyer.home');
    }
}
