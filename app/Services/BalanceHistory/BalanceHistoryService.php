<?php

namespace App\Services\BalanceHistory;

use App\Models\Mongo\BalanceHistories;

/**
 * Class BalanceHistoryService
 * @package App\Services
 */
class BalanceHistoryService
{

    public function getForTable($request){
        $page = $request['page'] ?? 1;
        $perPage = $request['perPage'] ?? 10;

        return BalanceHistories::with('customer:_id,name')
            ->filterSearch($request)
            ->filterCreatedDate($request)   
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function create($data)
    {
        return BalanceHistories::create($data);
    }

    public function update($item, $data)
    {
        return $item->update($data);
    }

    
}
