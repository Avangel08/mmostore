<?php

namespace App\Http\Controllers\Seller\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\SellerProfile\SellerProfileRequest;
use App\Services\PersonalAccessToken\PersonalAccessTokenService;
use App\Services\SellerProfile\SellerProfileService;
use Auth;
use Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ProfileController extends Controller
{
    protected $profileService;
    protected $personalAccessTokenService;

    public function __construct(SellerProfileService $profileService, PersonalAccessTokenService $personalAccessTokenService)
    {
        $this->profileService = $profileService;
        $this->personalAccessTokenService = $personalAccessTokenService;
    }

    public function index()
    {
        $user = Auth::guard(config('guard.seller'))->user();
        if (!$user) {
            return back()->with('error', 'User not found');
        }
        return Inertia::render('Profile/index', [
            'token' => Inertia::optional(fn() => $this->personalAccessTokenService->userGetFirstToken($user, ['id', 'token_plain_text', 'created_at', 'last_used_at'])),
        ]);
    }

    public function updateInfo(SellerProfileRequest $request)
    {
        try {
            $user = Auth::guard(config('guard.seller'))->user();
            if (!$user) {
                return back()->with('error', 'User not found');
            }
            $data = $request->validated();
            $this->profileService->updateInfo($user, $data);

            return back()->with('success', 'Update information successfully');
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.seller'))->id() ?? null]);

            return back()->with('error', $e->getMessage());
        }
    }

    public function changePassword(SellerProfileRequest $request)
    {
        try {
            $user = Auth::guard(config('guard.seller'))->user();
            if (!$user) {
                return back()->with('error', 'User not found');
            }
            $data = $request->validated();
            if (Hash::check($data['password'], auth(config('guard.seller'))->user()->password)) {
                throw ValidationException::withMessages([
                    'password' => "New password must be different from the current password",
                ]);
            }

            $this->profileService->changePassword($user, $data['password']);

            return back()->with('success', 'Password changed successfully');
        } catch (ValidationException $ve) {
            throw $ve;
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.seller'))->id() ?? null]);

            return back()->with('error', $e->getMessage());
        }
    }

    public function uploadImage(SellerProfileRequest $request)
    {
        try {
            $user = Auth::guard(config('guard.seller'))->user();
            if (!$user) {
                return back()->with('error', 'User not found');
            }

            $this->profileService->uploadProfileImage($user, $request->file('image'));

            return back()->with('success', 'Profile image updated successfully');
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.seller'))->id() ?? null]);

            return back()->with('error', $e->getMessage());
        }
    }

    public function createToken(SellerProfileRequest $request)
    {
        try {
            $user = Auth::guard(config('guard.seller'))->user();
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
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.seller'))->id() ?? null]);

            return back()->with('error', $e->getMessage());
        }
    }

    public function deleteToken(SellerProfileRequest $request, $tokenId)
    {
        try {
            $user = Auth::guard(config('guard.seller'))->user();
            if (!$user) {
                return back()->with('error', 'User not found');
            }

            // $token = $user->tokens()->find($tokenId)->select('id')->first();
            // if (!$token) {
            //     return back()->with('error', 'Token not found');
            // }

            // current 1 user 1 token - so delete is just revoke all
            $this->personalAccessTokenService->userRevokeAllTokens($user);

            return back()->with('success', 'Token deleted successfully');
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.seller'))->id() ?? null]);

            return back()->with('error', $e->getMessage());
        }
    }
}
