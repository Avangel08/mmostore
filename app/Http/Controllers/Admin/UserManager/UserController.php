<?php

namespace App\Http\Controllers\Admin\UserManager;

use App\Helpers\Helpers;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserManagement\UserManagementRequest;
use App\Jobs\Systems\JobProcessPaymentPlan;
use App\Models\MySQL\Stores;
use App\Models\MySQL\User;
use App\Services\Charge\ChargeService;
use App\Services\CurrencyRate\CurrencyRateService;
use App\Services\Home\StoreService;
use App\Services\Home\UserService;
use App\Services\StoreCategory\StoreCategoryService;
use App\Services\PaymentMethod\PaymentMethodService;
use App\Services\PaymentTransaction\PaymentTransactionAdminService;
use App\Services\Plan\PlanService;
use App\Services\PlanCheckout\PlanCheckoutService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Throwable;

class UserController extends Controller
{
    protected $userService;
    protected $planService;
    protected $paymentMethodService;
    protected $storeService;
    protected $storeCategoryService;
    protected $planCheckoutService;
    protected $chargeService;
    protected $paymentTransactionAdminService;
    protected $currencyRateService;

    public function __construct(
        UserService $userService,
        PlanService $planService,
        PaymentMethodService $paymentMethodService,
        StoreService $storeService,
        StoreCategoryService $storeCategoryService,
        PlanCheckoutService $planCheckoutService,
        ChargeService $chargeService,
        PaymentTransactionAdminService $paymentTransactionAdminService,
        CurrencyRateService $currencyRateService
    ) {
        $this->userService = $userService;
        $this->planService = $planService;
        $this->paymentMethodService = $paymentMethodService;
        $this->storeService = $storeService;
        $this->storeCategoryService = $storeCategoryService;
        $this->planCheckoutService = $planCheckoutService;
        $this->chargeService = $chargeService;
        $this->paymentTransactionAdminService = $paymentTransactionAdminService;
        $this->currencyRateService = $currencyRateService;
    }

    public function index(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);

        return Inertia::render('UserManager/index', [
            'users' => fn() => $this->userService->getAll(isPaginate: true, page: $page, perPage: $perPage, relation: ['stores:id,user_id,verified_at', 'currentPlan'], request: $request),
            'status' => fn() => User::STATUS,
            'type' => fn() => User::TYPE,
            'verifyStatus' => fn() => [
                'Verified' => 'VERIFIED',
                'Unverified' => 'UNVERIFIED',
            ],
            'detail' => fn() => $this->userService->findById(id: $request->input('id'), relation: ['currentPlan']),
            'verifyStoreData' => Inertia::optional(fn() => $this->userService->findById(id: $request->input('id'), relation: ['stores:id,user_id,name,domain,verified_at', 'stores.storeCategories:id,name,status'])),
            'storeCategoryOptions' => Inertia::optional(fn() => $this->storeCategoryService->getCategoryOptions()),
        ]);
    }

    public function add(UserManagementRequest $userRequest)
    {
        try {
            $data = $userRequest->validated();
            $data['password'] = Hash::make($data['password']);
            $this->userService->create($data);

            return back()->with('success', "User added successfully");
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function update($id, UserManagementRequest $userRequest)
    {
        try {
            $data = $userRequest->validated();
            $user = $this->userService->findById($id);

            if (!$user) {
                return back()->with('error', "User not found");
            }

            if ($data['status'] == User::STATUS['INACTIVE'] || $data['status'] == User::STATUS['BLOCK']) {
                $this->storeService->updateByUserId($id, ['status' => Stores::STATUS['INACTIVE']]);
            }

            $this->userService->update($user, $data);

            return back()->with('success', "User updated successfully");
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function delete(UserManagementRequest $userRequest)
    {
        try {
            $data = $userRequest->validated();
            $ids = $data['ids'] ?? [];

            if (empty($ids)) {
                return back()->with('error', "No users selected for deletion");
            }

            $this->userService->deletes($ids);

            return back()->with('success', "Deleted selected " . count($ids) . " user successfully");
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function loginAs($id)
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

        $scheme = request()->isSecure() ? 'https' : 'http';
        $tenantRoot = $scheme . '://' . $sub . '.' . $mainDomain;

        try {
            URL::forceRootUrl($tenantRoot);
            URL::forceScheme($scheme);

            $signedUrl = URL::temporarySignedRoute(
                'seller.magic-login',
                now()->addMinutes(2),
                [
                    'user_id' => $user->id,
                ]
            );
        } finally {
            URL::forceRootUrl(null);
        }

        return Redirect::away($signedUrl);
    }

    public function verifyStore(UserManagementRequest $request)
    {
        try {
            $data = $request->validated();
            $this->storeService->verifyStore($data['stores']);
            return back()->with('success', 'Saved verification information successfully');
        } catch (\Exception $e) {
            \Log::error($e, [
                'ip' => $request->ip(),
                'user_id' => auth(config('guard.admin'))->id() ?? null
            ]);
            return back()->with('error', $e->getMessage());
        }
    }

    public function getUserPaginateSelect(Request $request)
    {
        try {
            $searchTerm = $request->input('search', '');
            $page = (int) $request->input('page', 1);

            $options = $this->userService->getListUserPaginate($searchTerm, $page, 10);

            return response()->json([
                'results' => $options['results'] ?? [],
                'has_more' => $options['has_more'] ?? false,
            ]);
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.admin'))->id() ?? null]);

            return response()->json([
                'results' => [],
                'has_more' => false,
            ], 500);
        }
    }

    public function adminAddPlanSeller(UserManagementRequest $request)
    {
        try {
            $data = $request->validated();
            $user = $this->userService->findById($data['userId']);

            if (!$user) {
                return back()->with('error', 'User not found');
            }

            $plan = $this->planService->getById($data['planId']);
            if (!$plan) {
                return back()->with('error', 'Plan not found');
            }

            $paymentMethod = $this->paymentMethodService->findById($data['paymentMethodId']);
            if (!$paymentMethod) {
                return back()->with('error', 'Payment method not found');
            }

            $planCheckout = $this->planCheckoutService->createCheckout($user, $plan, $paymentMethod, true);
            $expireTimeByAdmin = Carbon::parse($data['datetimeExpired']);
            dispatch_sync(JobProcessPaymentPlan::forAdminAddPlan(checkoutId: $planCheckout->id, expireTimeByAdmin: $expireTimeByAdmin, note: $data['note'] ?? null));
            
            return back()->with('success', 'Plan added to user successfully');
        } catch(Throwable $th){
            \Log::error($th, ['ip' => $request->ip(), 'user_id' => auth(config('guard.admin'))->id() ?? null]);
            return back()->with('error', 'An error occurred, please try again later');
        }
    }
}
