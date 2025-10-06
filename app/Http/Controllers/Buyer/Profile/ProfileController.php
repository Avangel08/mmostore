<?php

namespace App\Http\Controllers\Buyer\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Buyer\BuyerProfile\BuyerProfileRequest;
use App\Services\BuyerProfile\BuyerProfileService;
use Auth;
use Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ProfileController extends Controller
{
    protected $buyerProfileService;

    public function __construct(BuyerProfileService $buyerProfileService)
    {
        $this->buyerProfileService = $buyerProfileService;
    }

    public function index()
    {
        $user = Auth::guard(config('guard.buyer'))->user();
        if (!$user) {
            return abort(404);
        }
        $theme = session('theme') ?? "Theme_1";
        return Inertia::render("Themes/{$theme}/Profile/index", [
            'purchasedCount' => Inertia::optional(function () {
                return 0;
            }),
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
}
