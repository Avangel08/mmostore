<?php

namespace App\Models\Mongo;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Eloquent\SoftDeletes;

class ImportAccountHistory extends Model
{
    use SoftDeletes;

    protected $table = 'import_account_history';

    protected $primaryKey = '_id';

    protected $connection = 'tenant_mongo';

    const STATUS = [
        'RUNNING' => 'RUNNING',
        'FINISH' => 'FINISH',
        'ERROR' => 'ERROR',
    ];

    const IMPORT_TYPE = [
        'ACCOUNT' => 'ACCOUNT',
    ];

    protected $fillable = [
        'type',
        'sub_product_id',
        'file_path',
        'status',
        'result',
        'ended_at',
    ];
}
