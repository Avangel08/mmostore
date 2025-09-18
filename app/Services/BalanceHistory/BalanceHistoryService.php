<?php

namespace App\Services\BalanceHistory;

use App\Models\Mongo\BalanceHistories;

/**
 * Class BalanceHistoryService
 * @package App\Services
 */
class BalanceHistoryService
{
    public function create($data)
    {
        return BalanceHistories::create($data);
    }

    public function update($item, $data)
    {
        return $item->update($data);
    }

    
}
