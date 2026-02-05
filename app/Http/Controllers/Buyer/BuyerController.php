<?php

namespace App\Http\Controllers\Buyer;

use App\Http\Controllers\Controller;
use App\Models\Mongo\Settings;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\Home\StoreService;
use App\Services\Setting\SettingService;

class BuyerController extends Controller
{
    protected $storeService;
    protected $settingService;

    public function __construct(StoreService $storeService, SettingService $settingService)
    {
        $this->storeService = $storeService;
        $this->settingService = $settingService;
    }

    /**
     * Get contacts data from settings
     */
    private function getContactsData()
    {
        $settings = $this->settingService->getSettings(true);
        $contacts = [];

        foreach ($settings as $setting) {
            if ($setting->key === 'contacts') {
                $contacts = json_decode($setting->value, true) ?: [];
                break;
            }
        }

        return $contacts;
    }

    public function home(): Response
    {
        $theme = "theme_1"; // This could be dynamic based on tenant settings 
        $user = auth('buyer')->user();
        $contacts = $this->getContactsData();

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

        return Inertia::render("Themes/{$theme}/Home/index", [
            'user' => $user,
            'isAuthenticated' => $user !== null,
            'contacts' => $contacts,
            'contact_types' => fn() => Settings::CONTACT_TYPES,
            'settings' => fn() => $result,
            'store' =>  fn() => $store,
            'domainSuffix' => config('app.domain_suffix'),
        ]);
    }

    public function products(): Response
    {
        $user = auth('buyer')->user();
        $contacts = $this->getContactsData();

        $store = app('store');

        return Inertia::render('Products/Index', [
            'user' => $user,
            'isAuthenticated' => $user !== null,
            'contacts' => $contacts,
            'contact_types' => fn() => Settings::CONTACT_TYPES
        ]);
    }

    public function about(): Response
    {
        $user = auth('buyer')->user();
        $contacts = $this->getContactsData();

        $store = app('store');
        
        return Inertia::render('About/Index', [
            'user' => $user,
            'isAuthenticated' => $user !== null,
            'contacts' => $contacts,
            'contact_types' => fn() => Settings::CONTACT_TYPES
        ]);
    }

    public function contact(): Response
    {
        $user = auth('buyer')->user();
        $contacts = $this->getContactsData();

        $store = app('store');

        return Inertia::render('Contact/Index', [
            'user' => $user,
            'isAuthenticated' => $user !== null,
            'contacts' => $contacts,
            'contact_types' => fn() => Settings::CONTACT_TYPES
        ]);
    }
}
