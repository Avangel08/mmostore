<?php

namespace App\Models\Mongo;

use MongoDB\Laravel\Eloquent\Model;

class Settings extends Model
{
    protected $table = 'settings';

    protected $connection = 'tenant_mongo';

    protected $fillable = [
        'key',
        'value',
        'auto_load',
    ];

    const CONTACT_TYPES = [
        'telegram' => [
            'value' => 'telegram',
            'label' => 'Telegram',
            'icon' => 'ri-telegram-line',
            'placeholder' => 'username',
            'url_format' => 'https://t.me/',
        ],
        'facebook' => [
            'value' => 'facebook',
            'label' => 'Facebook',
            'icon' => 'ri-facebook-line',
            'placeholder' => 'username',
            'url_format' => 'https://facebook.com/',
        ],
        'instagram' => [
            'value' => 'instagram',
            'label' => 'Instagram',
            'icon' => 'ri-instagram-line',
            'placeholder' => 'username',
            'url_format' => 'https://instagram.com/',
        ],
        'x' => [
            'value' => 'x',
            'label' => 'X',
            'icon' => 'ri-twitter-line',
            'placeholder' => 'username',
            'url_format' => 'https://x.com/',
        ],
        'whatsapp' => [
            'value' => 'whatsapp',
            'label' => 'WhatsApp',
            'icon' => 'ri-whatsapp-line',
            'placeholder' => 'số điện thoại (VD: +84123456789)',
            'url_format' => 'https://wa.me/',
        ],
        'discord' => [
            'value' => 'discord',
            'label' => 'Discord',
            'icon' => 'ri-discord-line',
            'placeholder' => 'server invite',
            'url_format' => 'https://discord.gg/',
        ],
        'email' => [
            'value' => 'email',
            'label' => 'Email',
            'icon' => 'ri-mail-line',
            'placeholder' => 'example@email.com',
            'url_format' => 'mailto:',
        ],
        'phone' => [
            'value' => 'phone',
            'label' => 'Phone',
            'icon' => 'ri-phone-line',
            'placeholder' => '+1234567890',
            'url_format' => 'tel:',
        ],
        'website' => [
            'value' => 'website',
            'label' => 'Website',
            'icon' => 'ri-global-line',
            'placeholder' => 'https://example.com',
            'url_format' => 'https://',
        ],
        'youtube' => [
            'value' => 'youtube',
            'label' => 'YouTube',
            'icon' => 'ri-youtube-line',
            'placeholder' => 'username',
            'url_format' => 'https://youtube.com/@',
        ],
        'zalo' => [
            'value' => 'zalo',
            'label' => 'Zalo',
            'icon' => 'ri-chat-3-line',
            'placeholder' => 'số điện thoại hoặc ID Zalo',
            'url_format' => 'https://zalo.me/',
        ],
    ];

    const CURRENCY_TYPES = [
        'VND' => 'VND',
        'USD' => 'USD'
    ];
}
