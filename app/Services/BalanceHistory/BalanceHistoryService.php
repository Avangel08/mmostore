<?php

namespace App\Services\BalanceHistory;

use App\Models\Mongo\BalanceHistories;

/**
 * Class BalanceHistoryService
 * @package App\Services
 */
class BalanceHistoryService
{

    public function getForTableCustomer($request, $customerId){
        $page = $request['page'] ?? 1;
        $perPage = $request['perPage'] ?? 10;

        return BalanceHistories::where('customer_id', $customerId)
            ->with('paymentMethod:id,name')
            ->filterSearch($request)
            ->filterDateAt($request)   
            ->orderBy('date_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
    }
    public function getForTable($request){
        $page = $request['page'] ?? 1;
        $perPage = $request['perPage'] ?? 10;

        return BalanceHistories::with('customer:_id,name')
            ->with('paymentMethod:id,name')
            ->filterSearch($request)
            ->filterDateAt($request)   
            ->orderBy('date_at', 'desc')
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
