<?php

namespace App\Services\PaymentTransaction;

use App\Models\MySQL\PaymentTransactions;

class PaymentTransactionAdminService
{
    public function getPaginateData($request)
    {
        $page = $request['page'] ?? 1;
        $perPage = $request['perPage'] ?? 10;

        return PaymentTransactions::with(['checkout:id,name,type,amount_vnd', 'user:id,name,email', 'paymentMethod:id,name', 'charge:id,expires_on'])
            ->select(['transaction_id', 'amount_vnd', 'note', 'system_note', 'status', 'created_at', 'check_out_id', 'payment_method_id', 'user_id', 'charge_id'])
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
    public function create($data)
    {
        return PaymentTransactions::create($data);
    }

    public function update(PaymentTransactions $paymentTransaction, $data)
    {
        return $paymentTransaction->update($data);
    }
}
