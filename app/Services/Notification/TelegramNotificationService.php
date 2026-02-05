<?php

namespace App\Services\Notification;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Services\Setting\SettingService;

class TelegramNotificationService
{
    protected $settingService;

    public function __construct(SettingService $settingService)
    {
        $this->settingService = $settingService;
    }

    public function sendOrderNotification(array $orderData): bool
    {
        try {
            $settings = $this->getNotificationSettings();
            
            if (!$settings['enabled']) {
                return false;
            }

            $groupId = $settings['groupId'];
            $topicId = $settings['topicId'];
            $message = $settings['message'];

            $message = $this->replacePlaceholders($message, $orderData);

            $botToken = config('telegram.bot_token');
            if (!$botToken) {
                return false;
            }

            $response = Http::post("https://api.telegram.org/bot{$botToken}/sendMessage", [
                'chat_id' => $groupId,
                'message_thread_id' => $topicId,
                'text' => $message,
                'parse_mode' => 'HTML'
            ]);

            if ($response->successful()) {
                $responseData = $response->json();
                if ($responseData['ok']) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } catch (\Exception $e) {
            return false;
        }
    }

    protected function getNotificationSettings(): array
    {
        $settings = $this->settingService->getSettings(true);
        $result = [];

        foreach ($settings as $setting) {
            $result[$setting->key] = $setting->value;
        }

        if (isset($result['notification'])) {
            $notification = $result['notification'];
            if (is_string($notification)) {
                $decoded = json_decode($notification, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                    $notification = $decoded;
                } else {
                    $notification = [];
                }
            }

            if (is_array($notification)) {
                return [
                    'enabled' => filter_var($notification['enabled'] ?? false, FILTER_VALIDATE_BOOLEAN),
                    'groupId' => $notification['groupId'] ?? '',
                    'topicId' => $notification['topicId'] ?? '',
                    'message' => $notification['message'] ?? '',
                ];
            }
        }

        return [
            'enabled' => filter_var($result['enabled'] ?? false, FILTER_VALIDATE_BOOLEAN),
            'groupId' => $result['groupId'] ?? '',
            'topicId' => $result['topicId'] ?? '',
            'message' => $result['message'] ?? '',
        ];
    }

    protected function replacePlaceholders(string $template, array $data): string
    {
        $replacements = [
            '{paid_time}' => $data['paid_time'] ?? now()->format('Y-m-d H:i:s'),
            '{order_id}' => $data['order_number'] ?? 'N/A',
            '{amount}' => $data['total_price'] ?? 'N/A',
            '{quantity}' => $data['quantity'] ?? 'N/A',
            '{product_name}' => $data['product_name'] ?? 'N/A',
        ];

        return str_replace(array_keys($replacements), array_values($replacements), $template);
    }
}
