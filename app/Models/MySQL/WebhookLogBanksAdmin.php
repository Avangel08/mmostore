<?php

namespace App\Models\MySQL;

use Illuminate\Database\Eloquent\Model;

class WebhookLogBanksAdmin extends Model
{
    const PLATFORM = [
        'SEPAY' => 'SEPAY',
    ];
    protected $connection = 'mysql';
    protected $table = 'webhook_log_banks';
    protected $fillable = [
        'platform',
        'gateway',
        'transaction',
        'data',
        'date_at',
    ];
    protected $casts = [
        'data' => 'array',
    ];
}
