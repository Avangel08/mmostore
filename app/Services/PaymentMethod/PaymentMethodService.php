<?php

namespace App\Services\PaymentMethod;

use App\Models\MySQL\PaymentMethods;

/**
 * Class PaymentMethodService
 * @package App\Services
 */
class PaymentMethodService
{
    public function updateOrCreate($data)
    {
        return PaymentMethods::updateOrCreate([
            'user_id' => $data['user_id'],
            'user_type' => $data['user_type'],
            'type' => $data['type'],
            'key' => $data['key']
        ],$data);
    }

    public function update($item, $data)
    {
        return $item->update($data);
    }
    
    public function delete($id)
    {
        return PaymentMethods::find($id)->delete();
    }
    
    
    public function findById($id)
    {
        return PaymentMethods::find($id);
    }

    public function findByUserId($userId)
    {
        return PaymentMethods::where('user_id', $userId)
        ->where('user_type', PaymentMethods::USER_TYPE['SELLER'])
        ->where('type', PaymentMethods::TYPE['BANK'])
        ->where('status', PaymentMethods::STATUS['ACTIVE'])
        ->first();
    }
}
