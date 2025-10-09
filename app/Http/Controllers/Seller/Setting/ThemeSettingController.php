<?php

namespace App\Http\Controllers\Seller\Setting;

use App\Http\Controllers\Controller;
use App\Services\Home\StoreService;
use App\Services\Setting\SettingService;
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
            $result[$setting->key] = $setting->value;
        }
        return Inertia::render('Settings/index', [
            'settings' => fn() => $result,
            'domains' => $store->domain,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validated();
        $this->settingService->createSetting($data);
    }

    public function update($sub, $id, Request $request)
    {
        $data = $request->validated();
        $setting = $this->settingService->getById($id);
        $this->settingService->updateSetting($setting, $data);
    }
}
