<?php

namespace App\Http\Controllers\Seller\Setting;

use App\Http\Controllers\Controller;
use App\Services\Setting\SettingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ThemeSettingController extends Controller
{
    protected $settingService;

    public function __construct(SettingService $settingService)
    {
        $this->settingService = $settingService;
    }

    public function index()
    {
        return Inertia::render('Settings/index', []);
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
