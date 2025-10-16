<?php

namespace App\Http\Controllers\Buyer\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Buyer\BuyerProfile\BuyerProfileRequest;
use App\Services\BuyerProfile\BuyerProfileService;
use App\Services\PersonalAccessToken\PersonalAccessTokenMongoService;
use Auth;
use Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ProfileController extends Controller
{
    protected $buyerProfileService;
    protected $personalAccessTokenService;

    public function __construct(BuyerProfileService $buyerProfileService, PersonalAccessTokenMongoService $personalAccessTokenService)
    {
        $this->buyerProfileService = $buyerProfileService;
        $this->personalAccessTokenService = $personalAccessTokenService;
    }

    public function index()
    {
        $user = Auth::guard(config('guard.buyer'))->user();
        if (!$user) {
            return abort(404);
        }
        $theme = session('theme') ?? "theme_1";
        return Inertia::render("Themes/{$theme}/Profile/index", [
            'purchasedCount' => Inertia::optional(function () {
                return 0;
            }),
            'token' => Inertia::optional(fn() => $this->personalAccessTokenService->userGetFirstToken($user, ['id', 'token_plain_text', 'created_at', 'last_used_at'])),
        ]);
    }

    public function updateInfo(BuyerProfileRequest $request)
    {
        try {
            $user = Auth::guard(config('guard.buyer'))->user();
            if (!$user) {
                return back()->with('error', 'User not found');
            }
            $data = $request->validated();
            $this->buyerProfileService->updateInfo($user, $data);

            return back()->with('success', 'Update information successfully');
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.buyer'))->id() ?? null]);

            return back()->with('error', $e->getMessage());
        }
    }

    public function changePassword(BuyerProfileRequest $request)
    {
        try {
            $user = Auth::guard(config('guard.buyer'))->user();
            if (!$user) {
                return back()->with('error', 'User not found');
            }
            $data = $request->validated();
            if (Hash::check($data['password'], auth(config('guard.buyer'))->user()->password)) {
                throw ValidationException::withMessages([
                    'password' => "New password must be different from the current password",
                ]);
            }

            $this->buyerProfileService->changePassword($user, $data['password']);

            return back()->with('success', 'Password changed successfully');
        } catch (ValidationException $ve) {
            throw $ve;
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.buyer'))->id() ?? null]);

            return back()->with('error', $e->getMessage());
        }
    }

    public function uploadImage(BuyerProfileRequest $request)
    {
        try {
            $user = Auth::guard(config('guard.buyer'))->user();
            if (!$user) {
                return back()->with('error', 'User not found');
            }

            $this->buyerProfileService->uploadProfileImage($user, $request->file('image'));

            return back()->with('success', 'Profile image updated successfully');
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.buyer'))->id() ?? null]);

            return back()->with('error', $e->getMessage());
        }
    }

    public function createToken(BuyerProfileRequest $request)
    {
        try {
            $user = Auth::guard(config('guard.buyer'))->user();
            if (!$user) {
                return back()->with('error', 'User not found');
            }

            if ($user->tokens()->count() > 0) {
                return back()->with('error', 'You already have a token. Please reload page to see your token');
            }

            $date = date('Ymd_His');
            $this->personalAccessTokenService->userCreateToken($user, "token-{$date}");

            return back()->with('success', 'Token created successfully');
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.buyer'))->id() ?? null]);

            return back()->with('error', $e->getMessage());
        }
    }

    public function deleteToken(BuyerProfileRequest $request, $tokenId)
    {
        try {
            $user = Auth::guard(config('guard.buyer'))->user();
            if (!$user) {
                return back()->with('error', 'User not found');
            }

            // current 1 user 1 token - so delete is just revoke all
            $this->personalAccessTokenService->userRevokeAllTokens($user);

            return back()->with('success', 'Token deleted successfully');
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.buyer'))->id() ?? null]);

            return back()->with('error', $e->getMessage());
        }
    }
}
