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

    public function create($data)
    {
        return PaymentMethodSeller::create($data);
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

    public function findByKey($key)
    {
        return PaymentMethodSeller::where('key', $key)->where('status', PaymentMethodSeller::STATUS['ACTIVE'])->first();
    }

    public function listActive(){
        return PaymentMethodSeller::where('status', PaymentMethodSeller::STATUS['ACTIVE'])->orderBy('type', 'asc')->get();
    }

    public function getForTable($request){
        $page = $request['page'] ?? 1;
        $perPage = $request['perPage'] ?? 10;
        $typeNotIn = [PaymentMethodSeller::TYPE['BALANCE']];
        return PaymentMethodSeller::filterSearch($request)
        ->filterCreatedDate($request)
        ->whereNotIn('type', $typeNotIn)
        ->orderBy('created_at', 'desc')
        ->paginate($perPage, ['*'], 'page', $page);
    }

    public function renderLinkWebhook($host)
    {
        $endPoint = "api/v1/webhook/sepay";
        return $host . "/" . $endPoint;
    }
}
