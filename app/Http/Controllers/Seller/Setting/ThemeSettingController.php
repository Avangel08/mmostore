<?php

namespace App\Http\Controllers\Seller\Setting;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\Settings\SettingsRequest;
use App\Models\Mongo\Settings;
use App\Services\Home\StoreService;
use App\Services\Setting\SettingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;

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
            if ($setting->key === 'contacts' || $setting->key === 'domains' || $setting->key === 'notification') {
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
            if ($key === 'tab') {
                continue;
            }
            if ($request->hasFile($key)) {
                $host = request()->getHost();
                $extension = $data[$key]->getClientOriginalExtension();
                $fileName = $key . '.' . $extension;
                $imagePath = $data[$key]->storeAs("{$host}/settings", $fileName, 'public');
                $value = $imagePath;
            }

            if ($key === 'contacts' || $key === 'domains' || $key === 'notification') {
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

    public function testTelegram(Request $request)
    {
        $request->validate([
            // support both new and old field names
            'groupId' => 'required_without:telegramGroupId|string|nullable',
            'telegramGroupId' => 'required_without:groupId|string|nullable',
            'topicId' => 'required_without:telegramTopicId|string|nullable',
            'telegramTopicId' => 'required_without:topicId|string|nullable',
            'message' => 'required_without:messageTemplate|string|nullable',
            'messageTemplate' => 'required_without:message|string|nullable',
        ]);

        $groupId = $request->input('groupId') ?? $request->input('telegramGroupId');
        $topicId = $request->input('topicId') ?? $request->input('telegramTopicId');
        $messageTemplate = $request->input('message') ?? $request->input('messageTemplate');

        $testMessage = str_replace([
            '{paid_time}',
            '{order_id}',
            '{amount}',
            '{quantity}',
            '{buyer_note}',
            '{product_name}'
        ], [
            now()->format('Y-m-d H:i:s'),
            'TEST-' . rand(1000, 9999),
            '100,000 VND',
            '2',
            'Đây là ghi chú test',
            'Sản phẩm test x2'
        ], $messageTemplate);

        try {
            $botToken = config('telegram.bot_token');
            if (!$botToken) {
                return redirect()->back()->with([
                    'message' => [
                        'error' => 'Telegram bot token not configured'
                    ]
                ]);
            }

            $response = Http::post("https://api.telegram.org/bot{$botToken}/sendMessage", [
                'chat_id' => $groupId,
                'message_thread_id' => $topicId,
                'text' => $testMessage,
                'parse_mode' => 'HTML'
            ]);

            if ($response->successful()) {
                $responseData = $response->json();
                if ($responseData['ok']) {
                    return redirect()->back()->with([
                        'message' => [
                            'success' => 'Test notification sent successfully'
                        ]
                    ]);
                } else {
                    return redirect()->back()->with([
                        'message' => [
                            'error' => 'Failed to send test notification: ' . ($responseData['description'] ?? 'Unknown error')
                        ]
                    ]);
                }
            } else {
                return redirect()->back()->with([
                    'message' => [
                        'error' => 'Failed to connect to Telegram API'
                    ]
                ]);
            }
        } catch (\Exception $e) {
            return redirect()->back()->with([
                'message' => [
                    'error' => 'Error sending test notification: ' . $e->getMessage()
                ]
            ]);
        }
    }
}
