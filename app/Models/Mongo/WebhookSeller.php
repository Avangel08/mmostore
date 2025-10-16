<?php

namespace App\Models\Mongo;

use MongoDB\Laravel\Eloquent\Model;

class WebhookSeller extends Model
{
    protected $table = 'webhook_sellers';

    protected $connection = 'mongodb';
    protected $fillable = [
        "platform",
        "gateway",
        "transaction",
        "data",
        "date_at"
    ];
}
