<?php

namespace App\Http\Controllers\Seller\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\SellerProfile\SellerProfileRequest;
use App\Services\SellerProfile\SellerProfileService;
use Auth;
use Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ProfileController extends Controller
{
    protected $profileService;

    public function __construct(SellerProfileService $profileService)
    {
        $this->profileService = $profileService;
    }

    public function index()
    {
        return Inertia::render('Profile/index', [
        ]);
    }

    public function updateInfo(SellerProfileRequest $request)
    {
        try {
            $user = Auth::guard(config('guard.seller'))->user();
            if (!$user) {
                return redirect()->back()->with('error', 'User not found');
            }
            $data = $request->validated();
            $this->profileService->updateInfo($user, $data);

            return redirect()->back()->with('success', 'Update information successfully');
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.seller'))->id() ?? null]);

            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function changePassword(SellerProfileRequest $request)
    {
        try {
            $user = Auth::guard(config('guard.seller'))->user();
            if (!$user) {
                return redirect()->back()->with('error', 'User not found');
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
}
