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

    public function updateOrCreate($data)
    {
        return Deposits::updateOrCreate([
            'customer_id' => $data['customer_id'],
            'email' => $data['email'],
            'payment_method_id' => $data['payment_method_id'],
            'amount' => $data['amount'],
            'amount_vnd' => $data['amount_vnd'],
            'status' => $data['status'],
        ], $data);
    }
}
