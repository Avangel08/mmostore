<?php

namespace App\Models\Mongo;

use MongoDB\Laravel\Eloquent\Model;

class BankHistoryLogs extends Model
{
    protected $connection = "mongodb";
    protected $table = 'bank_history_logs';

    protected $guarded = [];
}
