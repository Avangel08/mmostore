<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Telegram Bot Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains the configuration for Telegram bot integration.
    | You can set your bot token here or use environment variables.
    |
    */

    'bot_token' => env('TELEGRAM_BOT_TOKEN'),
    
    /*
    |--------------------------------------------------------------------------
    | Default Settings
    |--------------------------------------------------------------------------
    |
    | Default settings for Telegram notifications
    |
    */
    
    'default_settings' => [
        'parse_mode' => 'HTML',
        'disable_web_page_preview' => true,
    ],
];
