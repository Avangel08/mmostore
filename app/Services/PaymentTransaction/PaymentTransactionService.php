<?php

namespace App\Services\PaymentTransaction;

use App\Models\MySQL\PaymentTransactions;
use App\Models\MySQL\User;

/**
 * Class PaymentTransactionService
 * @package App\Services
 */
class PaymentTransactionService
{
    public function create($data)
    {
        return PaymentTransactions::create($data);
    }

    public function update(PaymentTransactions $paymentTransaction, $data)
    {
        return $paymentTransaction->update($data);
    }
}
