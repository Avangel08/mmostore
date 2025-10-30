<?php

namespace App\Http\Controllers\Buyer\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Buyer\BuyerProfile\BuyerProfileRequest;
use App\Services\BuyerProfile\BuyerProfileService;
use App\Models\Mongo\CustomerAccessToken;
use App\Services\CustomerAccessToken\CustomerAccessTokenService;
use App\Services\Order\OrderService;
use App\Services\Setting\SettingService;
use Illuminate\Support\Facades\Auth;
use Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ProfileController extends Controller
{
    protected $buyerProfileService;
    protected $customerAccessTokenService;
    protected $orderService;
    protected $settingService;

    public function __construct(
        BuyerProfileService $buyerProfileService,
        CustomerAccessTokenService $customerAccessTokenService,
        OrderService $orderService,
        SettingService $settingService
    ) {
        $this->buyerProfileService = $buyerProfileService;
        $this->customerAccessTokenService = $customerAccessTokenService;
        $this->orderService = $orderService;
        $this->settingService = $settingService;
    }

    public function index()
    {
        $user = Auth::guard(config('guard.buyer'))->user();
        $theme = session('theme') ?? "theme_1";

        if (!$user) {
            return back()->with('error', 'User not found');
        }
        $store = app('store');
        $settings = $this->settingService->getSettings(true);
        $result = [];
        foreach ($settings as $setting) {
            if ($setting->key === 'contacts' || $setting->key === 'domains' || $setting->key === 'menus') {
                $result[$setting->key] = json_decode($setting->value, true) ?: [];
            } else {
                $result[$setting->key] = $setting->value;
            }
        }
        return Inertia::render("Themes/{$theme}/Profile/index", [
            'purchasedCount' => Inertia::optional(fn() => $this->orderService->countQuantityPurchasedByOrder($user->_id)),
            'token' => $this->customerAccessTokenService->userFindFirstTokenByTokenable(
                $user,
                ['_id as id', 'token_plain_text', 'created_at', 'last_used_at']
            ),
            'store' =>  fn() => $store,
            'domainSuffix' => config('app.domain_suffix'),
            'settings' => fn() => $result
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

            $this->customerAccessTokenService->userCreateTokenDirect($user);

            return back()->with('success', 'Token created successfully');
        } catch (\Throwable $e) {
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

            $this->customerAccessTokenService->userRevokeAllTokens($user);

            return back()->with('success', 'Token deleted successfully');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
