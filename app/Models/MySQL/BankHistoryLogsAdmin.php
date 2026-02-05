<?php

namespace App\Models\MySQL;

use Illuminate\Database\Eloquent\Model;

class BankHistoryLogsAdmin extends Model
{
    protected $connection = 'mysql';
    protected $table = 'bank_history_logs';
    protected $fillable = [
        'bank',
        'user_id',
        'content_bank',
        'amount',
        'date',
        'description',
        'key_unique',
        'json',
        'error_info'
    ];
    protected $casts = [
        'json' => 'array',
        'error_info' => 'array',
    ];
}
