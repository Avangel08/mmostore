<?php

namespace App\Http\Controllers\Seller\Setting;

use App\Http\Controllers\Controller;
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
            if ($setting->key === 'contacts' || $setting->key === 'domains') {
                $result[$setting->key] = json_decode($setting->value, true) ?: [];
            } else {
                $result[$setting->key] = $setting->value;
            }
        }

        return Inertia::render('Settings/index', [
            'settings' => fn() => $result,
            'domains' => $store->domain,
            'domainSuffix' => config('app.domain_suffix'),
            'contact_types' => fn() => Settings::CONTACT_TYPES,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validated();
        $this->settingService->createSetting($data);
    }

    public function update(Request $request)
    {
        $theme = $request->input('theme');
        $data = $request->all();
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
            $this->settingService->updateOrCreateSetting($key, $value);
        }
        if ($domainSettings) {
            $newDomains = json_decode($domainSettings);
            $domains = $store->domain;
            // tránh trùng lặp
            if (!in_array($newDomains, $domains)) {
                // ✅ Merge và loại bỏ trùng
                $mergedDomains = array_values(array_unique(array_merge($domains, $newDomains)));
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
