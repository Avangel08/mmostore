<?php

namespace App\Services\PaymentTransaction;

use App\Models\MySQL\PaymentTransactions;
use Cache;

class PaymentTransactionAdminService
{
    public function getPaginateData($request)
    {
        $page = $request['page'] ?? 1;
        $perPage = $request['perPage'] ?? 10;

        return PaymentTransactions::with(['checkout:id,name,type,amount_vnd', 'user:id,name,email', 'paymentMethod:id,name', 'charge:id,expires_on', 'creator:id,name,email'])
            ->select(['transaction_id', 'amount_vnd', 'note', 'system_note', 'status', 'created_at', 'check_out_id', 'payment_method_id', 'user_id', 'charge_id', 'creator_id'])
            ->filterPlanName($request)
            ->filterUserId($request)
            ->filterPaymentMethod($request)
            ->filterPlanType($request)
            ->filterStatus($request)
            ->filterCreatedDate($request)
            ->filterExpirationDate($request)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function findById($id, $select = ['*'], $relation = [])
    {
        return PaymentTransactions::where('id', $id)->select($select)->with($relation)->first();
    }

    public function create($data)
    {
        return PaymentTransactions::create($data);
    }

    public function update(PaymentTransactions $paymentTransaction, $data)
    {
        return $paymentTransaction->update($data);
    }

    public function getCacheTag()
    {
        return 'payment_transaction';
    }

    public function getCacheKey($userId)
    {
        return 'purchase_user_id_' . $userId;
    }

    public function rememberPurchaseCache(array $data)
    {
        return Cache::tags([$this->getCacheTag()])->forever($this->getCacheKey($data['user_id']), $data);
    }

    public function forgetPurchaseCache($userId)
    {
        Cache::tags([$this->getCacheTag()])->forget($this->getCacheKey($userId));
    }

    public function checkPurchaseCache($userId)
    {
        return Cache::tags([$this->getCacheTag()])->get($this->getCacheKey($userId));
    }
}
