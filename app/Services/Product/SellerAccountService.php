<?php

namespace App\Services\Product;

use App\Jobs\ImportAccount\JobImportAccount;
use App\Models\Mongo\Accounts;
use App\Models\Mongo\ImportAccountHistory;
use Carbon\Carbon;
use Config;
use DB;
use Storage;

/**
 * Class SellerAccountService
 */
class SellerAccountService
{
    public function getById($id, $select = ['*'], $relation = [])
    {
        return Accounts::select($select)->with($relation)->where('_id', $id)->first();
    }

    public function processAccountFile(array $data)
    {
        $file = $data['file'];
        $host = request()->getHost();

        $fileName = 'accounts_'.time().'_'.$file->getClientOriginalName();
        $filePath = $file->storeAs("{$host}/accounts", $fileName, 'public');
        $dbConfig = Config::get('database.connections.tenant_mongo');
        $importAccountHistory = $this->createImportAccountHistory($data['sub_product_id'], $filePath);
        JobImportAccount::dispatch($filePath, $data['product_id'], $data['sub_product_id'], $importAccountHistory?->id, $dbConfig);
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

    public function insert($data)
    {
        return Accounts::insert($data);
    }

    public function createImportAccountHistory($subProductId, $filePath)
    {
        return ImportAccountHistory::create([
            'type' => ImportAccountHistory::IMPORT_TYPE['ACCOUNT'],
            'sub_product_id' => $subProductId,
            'file_path' => $filePath,
            'status' => ImportAccountHistory::STATUS['RUNNING'],
            'result' => null,
            'ended_at' => null,
        ]);
    }

    public function getAccountCountBySubProductId($subProductId)
    {
        return Accounts::where('sub_product_id', $subProductId)->count();
    }

    public function deleteOldAccounts(Carbon $timeStart, array $listKey, $subProductId)
    {
        return Accounts::where('sub_product_id', $subProductId)
            ->whereNull('order_id')
            ->whereIn('key', $listKey)
            ->where('created_at', '!=', new \MongoDB\BSON\UTCDateTime($timeStart))
            ->delete();
    }

    public function deleteUnsoldAccounts($subProductId)
    {
        return Accounts::where('sub_product_id', $subProductId)
            ->whereNull('order_id')
            ->delete();
    }

    public function exportUnsoldAccounts($subProductId)
    {
        $host = request()->getHost();
        $fileName = 'unsold_accounts_' . $subProductId . '_' . time() . '.txt';
        $filePath = "{$host}/exports/{$fileName}";
        $fullPath = Storage::disk('public')->path($filePath);
        
        $directory = dirname($fullPath);
        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        $file = fopen($fullPath, 'w');
        if (!$file) {
            throw new \Exception('Cannot create export file');
        }

        $chunkSize = 1000;
        $totalExported = 0;

        try {
            Accounts::select(['key', 'data'])
                ->where('sub_product_id', $subProductId)
                ->whereNull('order_id')
                ->where('status', Accounts::STATUS['LIVE'])
                ->chunk($chunkSize, function ($accounts) use ($file, &$totalExported) {
                    foreach ($accounts as $account) {
                        $line = $account->key . '|' . $account->data . PHP_EOL;
                        fwrite($file, $line);
                        $totalExported++;
                    }
                    unset($accounts);
                });
            
        } finally {
            fclose($file);
        }
        return [
            'file_path' => $filePath,
            'file_name' => $fileName,
            'full_path' => $fullPath,
            'total_exported' => $totalExported,
            'download_url' => Storage::disk('public')->url($filePath)
        ];
    }
}
