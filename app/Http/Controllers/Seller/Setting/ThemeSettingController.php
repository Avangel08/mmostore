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
        $userId = $user->id;
        $store = $this->storeService->findByUserId($userId, ['*'], 'setting');
        if (!$store) {
            abort(404);
        }
        return Inertia::render('Settings/index', [
            'settings' => fn() => [
                'domain' => $store->domain,
                'theme' => $store->setting->theme,
                'store_settings' => $store->setting->store_settings
            ]
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
