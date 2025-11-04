<?php

namespace App\Http\Controllers\Buyer\PaymentHistory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Services\BalanceHistory\BalanceHistoryService;
use App\Services\Setting\SettingService;

class PaymentHistoryController extends Controller
{
    protected $balanceHistoryService;
    protected $settingService;
    public function __construct(BalanceHistoryService $balanceHistoryService, SettingService $settingService)
    {
        $this->balanceHistoryService = $balanceHistoryService;
        $this->settingService = $settingService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $theme = session('theme') ?? "theme_1";
        $request = $request->all();
        $customerId = Auth::guard('buyer')->user()->id;
        $store = app('store');
        $listBalanceHistory = $this->balanceHistoryService->getForTableCustomer($request, $customerId);

        $settings = $this->settingService->getSettings(true);
        $result = [];
        foreach ($settings as $setting) {
            if ($setting->key === 'contacts' || $setting->key === 'domains' || $setting->key === 'menus') {
                $result[$setting->key] = json_decode($setting->value, true) ?: [];
            } else {
                $result[$setting->key] = $setting->value;
            }
        }
        return Inertia::render("Themes/{$theme}/PaymentHistory/index", [
            'listBalanceHistory' => $listBalanceHistory,
            'store' =>  fn() => $store,
            'domainSuffix' => config('app.domain_suffix'),
            'settings' => fn() => $result
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
