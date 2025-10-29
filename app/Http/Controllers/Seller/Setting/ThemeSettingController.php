<?php

namespace App\Http\Controllers\Seller\Setting;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\Settings\SettingsRequest;
use App\Models\Mongo\Settings;
use App\Services\Home\StoreService;
use App\Services\Setting\SettingService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ThemeSettingController extends Controller
{
    protected $settingService;
    protected $storeService;

    public function __construct(SettingService $settingService, StoreService $storeService)
    {
        $this->settingService = $settingService;
        $this->storeService = $storeService;
    }

    public function index()
    {
        $user = auth('seller')->user();
        $store = $this->storeService->findByUserId($user->id);
        if (!$store) {
            abort(404);
        }
        $settings = $this->settingService->getSettings(true);
        $result = [];

        foreach ($settings as $setting) {
            if ($setting->key === 'contacts' || $setting->key === 'domains' || $setting->key === 'menus') {
                $result[$setting->key] = json_decode($setting->value, true) ?: [];
            } else {
                $result[$setting->key] = $setting->value;
            }
        }

        $currencyOptions = [];
        foreach (Settings::CURRENCY_TYPES as $key => $value) {
            $currencyOptions[] = [
                'label' => $key,
                'value' => $key
            ];
        }
        return Inertia::render('Settings/index', [
            'settings' => fn() => $result,
            'domains' => $store->domain,
            'domainSuffix' => config('app.domain_suffix'),
            'contact_types' => fn() => Settings::CONTACT_TYPES,
            'currency_options' => fn() => $currencyOptions
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validated();
        $this->settingService->createSetting($data);
    }

    public function update(SettingsRequest $request)
    {
        $theme = $request->input('theme');
        $data = $request->validated();
        $domainSettings = $request->input('domains');
        $user = auth('seller')->user();
        $store = $this->storeService->findByUserId($user->id);
        if (!$store) {
            abort(404);
        }
        foreach ($data as $key => $value) {
            if ($request->hasFile($key)) {
                $host = request()->getHost();
                $extension = $data[$key]->getClientOriginalExtension();
                $fileName = $key . '.' . $extension;
                $imagePath = $data[$key]->storeAs("{$host}/settings", $fileName, 'public');
                $value = $imagePath;
            }
            if ($key === 'contacts' || $key === 'domains' || $key === 'menus') {
                $value = json_encode($value);
            }
            $this->settingService->updateOrCreateSetting($key, $value);
        }
        if ($domainSettings) {
            $domains = $store->domain;
            $domainDefault = collect($domains)->first(fn($d) => str_contains($d, config('app.domain_suffix')));
            $mergedDomains[] = $domainDefault;
            // tránh trùng lặp
            if (!in_array($domainSettings, $domains)) {
                // ✅ Merge và loại bỏ trùng
                $mergedDomains = array_values(array_unique(array_merge($mergedDomains, $domainSettings)));
                $this->storeService->update($store, ['domain' => $mergedDomains]);
            }
        }

        // $storeSettings = json_decode($request->input('store_settings'), true);

        // $this->settingService->updateOrCreateSetting('theme', $theme);

        // if ($storeSettings) {
        //     foreach ($storeSettings as $key => $value) {
        //         if ($key === 'contacts') {
        //             $value = json_encode($value);
        //         }
        //         $this->settingService->updateOrCreateSetting($key, $value);
        //     }
        // }

        return redirect()->back()->with([
            'message' => [
                'success' => 'Settings updated successfully'
            ]
        ]);
    }
}
