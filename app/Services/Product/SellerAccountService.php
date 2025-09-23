<?php

namespace App\Services\Product;

use App\Jobs\ImportAccount\ImportAccount;
use App\Jobs\ImportAccount\JobImportAccount;
use App\Models\Mongo\Accounts;
use Config;
use DB;

/**
 * Class SellerAccountService
 */
class SellerAccountService
{
    public function getById($id, $select = ['*'], $relation = [])
    {
        return Accounts::select($select)->with($relation)->where('_id', $id)->first();
    }

    public function findBySubProductId($id, $select = ['*'], $relation = [])
    {
        return Accounts::select($select)->with($relation)->where('sub_product_id', $id)->get();
    }

    public function processAccountFile(array $data)
    {
        $file = $data['file'];
        $host = request()->getHost();
        
        $fileName = 'accounts_'.time().'_'.$file->getClientOriginalName();
        $filePath = $file->storeAs("{$host}/accounts", $fileName, 'public');
        $dbConfig = Config::get('database.connections.tenant_mongo');
        JobImportAccount::dispatch($filePath, $data['product_id'], $data['sub_product_id'], $dbConfig);
    }

    public function replaceOldAccounts($subProductId, $listKey, array $data)
    {
        DB::transaction(function () use ($subProductId, $listKey, $data) {
            Accounts::where('sub_product_id', $subProductId)->whereIn('key', $listKey)->delete();

            foreach ($data as $account) {
                $this->createAccount($account);
            }
        });
    }

    public function createAccount(array $data)
    {
        $accountData = [
            'product_id' => $data['product_id'],
            'sub_product_id' => $data['sub_product_id'],
            'key' => $data['key'],
            'data' => $data['data'],
            'status' => $data['status'],
            'note' => $data['note'] ?? null,
            'customer_id' => $data['customer_id'] ?? null,
            'order_id' => $data['order_id'] ?? null,
        ];

        return Accounts::create($accountData);
    }

    public function delete(Accounts $account)
    {
        return $account->delete();
    }
}
