<?php

namespace App\Models\Mongo;

use MongoDB\Laravel\Eloquent\Model;

class WebhookLogBanks extends Model
{
    const PLATFORM = [
        'SEPAY' => 'SEPAY',
    ];
    protected $table = 'webhook_log_banks';
    protected $fillable = [
        'platform',
        'gateway',
        'transaction',
        'data',
        'date_at',
    ];
}
