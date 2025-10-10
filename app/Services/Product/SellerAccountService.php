<?php

namespace App\Services\Product;

use App\Jobs\SellerAccount\JobDeleteUnsoldAccount;
use App\Jobs\SellerAccount\JobImportAccount;
use App\Models\Mongo\Accounts;
use App\Models\Mongo\ImportAccountHistory;
use App\Models\Mongo\Products;
use App\Models\Mongo\SubProducts;
use Carbon\Carbon;
use Config;
use Illuminate\Support\Facades\Storage;

/**
 * Class SellerAccountService
 */
class SellerAccountService
{
    public function getForTable($subProductId, $request)
    {
        $page = $request->input('accountPage', 1);
        $perPage = $request->input('accountPerPage', 10);

        return Accounts::where('sub_product_id', $subProductId)
            ->filterProduct($request)
            ->filterStatus($request)
            ->filterCreatedDate($request)
            ->filterOrderId($request)
            ->filterSellStatus($request)
            ->orderBy('_id', 'desc')
            ->cursorPaginate($perPage, ['*'], 'page', $page);
    }

    public function getById($id, $select = ['*'], $relation = [])
    {
        return Accounts::select($select)->with($relation)->where('_id', $id)->first();
    }

    public function processAccountFile($categoryId, $productTypeId, $data)
    {
        $inputMethod = $data['input_method'] ?? Accounts::INPUT_METHOD['FILE'];
        $host = request()->getHost();
        $dbConfig = Config::get('database.connections.tenant_mongo');
        
        if ($inputMethod === Accounts::INPUT_METHOD['FILE']) {
            $file = $data['file'];
            $fileName = 'accounts_' . time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs("{$host}/accounts", $fileName, 'public');
            $importAccountHistory = $this->createImportAccountHistory($data['sub_product_id'], $filePath);
            JobImportAccount::dispatch($filePath, $data['product_id'], $data['sub_product_id'], $categoryId, $productTypeId, $importAccountHistory?->id, $dbConfig, Accounts::INPUT_METHOD['FILE']);
        } elseif ($inputMethod === Accounts::INPUT_METHOD['TEXTAREA']) {
            $content = $data['content'];
            $fileName = 'input_accounts_' . time() . '.txt';
            $filePath = "{$host}/accounts/{$fileName}";
            Storage::disk('public')->put($filePath, $content);
            $importAccountHistory = $this->createImportAccountHistory($data['sub_product_id'], $filePath);
            JobImportAccount::dispatch($filePath, $data['product_id'], $data['sub_product_id'], $categoryId, $productTypeId, $importAccountHistory?->id, $dbConfig, Accounts::INPUT_METHOD['TEXTAREA']);
        }
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

    public function getUnsoldAccountCountBySubProductId($subProductId)
    {
        return Accounts::where('sub_product_id', $subProductId)->whereNull('order_id')->count();
    }

    public function deleteOldAccounts(Carbon $timeStart, array $listKey, $subProductId)
    {
        $batchSize = 1000;
        do {
            $deletedCount = Accounts::where('sub_product_id', $subProductId)
                ->whereNull('order_id')
                ->whereIn('key', $listKey)
                ->where('created_at', '<', new \MongoDB\BSON\UTCDateTime($timeStart))
                ->limit($batchSize)
                ->forceDelete();
        } while ($deletedCount > 0);
    }

    public function deleteUnsoldAccounts($subProductId)
    {
        // DB::transaction(function () use ($subProductId) {
        $batchSize = 1000;
        do {
            $deletedCount = Accounts::where('sub_product_id', $subProductId)
                ->whereNull('order_id')
                ->limit($batchSize)
                ->forceDelete();
        } while ($deletedCount > 0);
        $totalProduct = $this->getUnsoldAccountCountBySubProductId($subProductId);
        $subProductService = new SubProductService;
        $subProductService->updateSubProductQuantity($subProductId, $totalProduct);
        // });
    }

    public function streamDownloadUnsoldAccounts($subProductId)
    {
        set_time_limit(0);
        $fileName = 'unsold_accounts_' . $subProductId . '_' . time() . '.txt';

        $headers = [
            'Content-Type' => 'text/plain',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ];

        return response()->stream(function () use ($subProductId) {
            $handle = fopen('php://output', 'w');

            Accounts::select(['key', 'data', 'status'])
                ->where('sub_product_id', $subProductId)
                ->whereNull('order_id')
                ->cursor()
                ->each(function ($account) use ($handle) {
                    if (isset($account->status) && isset($account->key) && isset($account->data)) {
                        fwrite($handle, "status:{$account->status}|{$account->key}|{$account->data}" . PHP_EOL);
                    }
                });

            fclose($handle);
        }, 200, $headers);
    }

    public function startDeleteUnsoldAccount($subProductId)
    {
        JobDeleteUnsoldAccount::dispatch($subProductId, Config::get('database.connections.tenant_mongo'));
    }

    public function checkUniqueData($categoryId, $productTypeId, array $mainData)
    {
        if (!$categoryId || !$productTypeId) {
            return array_fill_keys($mainData, false);
        }

        $existingMainData = Accounts::select('main_data')->where('category_id', $categoryId)
            ->where('product_type_id', $productTypeId)
            ->whereIn('main_data', $mainData)
            ->pluck('main_data')
            ->toArray();

        $existingMainDataMap = array_flip($existingMainData);

        $result = [];
        foreach ($mainData as $data) {
            $result[$data] = !isset($existingMainDataMap[$data]);
        }

        return $result;
    }
}
