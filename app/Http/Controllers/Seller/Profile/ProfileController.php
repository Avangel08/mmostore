<?php

namespace App\Http\Controllers\Seller\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\Profile\ProfileRequest;
use App\Services\SellerProfile\SellerProfileService;
use Auth;
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

    public function updateInfo(ProfileRequest $request)
    {
        try {
            $user = Auth::guard(config('guard.seller'))->user();
            if (! $user) {
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

    public function changePassword(ProfileRequest $request)
    {
        try {
            $user = Auth::guard(config('guard.seller'))->user();
            if (! $user) {
                return redirect()->back()->with('error', 'User not found');
            }
            $data = $request->validated();
            $this->profileService->changePassword($user, $data['password']);

            return redirect()->back()->with('success', 'Password changed successfully');
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.seller'))->id() ?? null]);

            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
