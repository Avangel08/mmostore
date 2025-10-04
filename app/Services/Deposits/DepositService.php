<?php

namespace App\Services\Deposits;

use App\Models\Mongo\Deposits;

/**
 * Class DepositService
 * @package App\Services
 */
class DepositService
{

    public function create($data)
    {
        return Deposits::create($data);
    }

    public function update($item, $data)
    {
        return $item->update($data);
    }

    public function checkExist($data)
    {
        return Deposits::where('customer_id', $data['customer_id'])
        ->where('email', $data['email'])
        ->where('payment_method_id', $data['payment_method_id'])
        ->where('amount', $data['amount'])
        ->where('amount_vnd', $data['amount_vnd'])
        ->where('status', $data['status'])
        ->first();
    }

    public function findByContentBank($contentBank)
    {
        return Deposits::where('content_bank', $contentBank)->where('status', Deposits::STATUS['PENDING'])->first();
    }
}
