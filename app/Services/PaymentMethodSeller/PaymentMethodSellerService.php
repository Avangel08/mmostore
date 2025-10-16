<?php

namespace App\Services\PaymentMethodSeller;

use App\Models\Mongo\PaymentMethodSeller;

/**
 * Class PaymentMethodSellerService
 * @package App\Services
 */
class PaymentMethodSellerService
{
    public function updateOrCreate($data)
    {
        return PaymentMethodSeller::updateOrCreate([
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
        return PaymentMethodSeller::find($id)->delete();
    }
    
    
    public function findById($id)
    {
        return PaymentMethodSeller::find($id);
    }

    public function listActive(){
        return PaymentMethodSeller::where('status', PaymentMethodSeller::STATUS['ACTIVE'])->orderBy('type', 'asc')->get();
    }

    public function findForCheckout($type, $key){
        return PaymentMethodSeller::where('type', $type)
        ->where('key', $key)
        ->where('status', PaymentMethodSeller::STATUS['ACTIVE'])
        ->first();
    }
}
