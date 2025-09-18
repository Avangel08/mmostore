<?php

namespace App\Services\PaymentMethod;

use App\Models\MySQL\PaymentMethods;

/**
 * Class PaymentMethodService
 * @package App\Services
 */
class PaymentMethodService
{
    public function create($data)
    {
        return PaymentMethods::create($data);
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

}
