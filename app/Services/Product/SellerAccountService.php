<?php

namespace App\Services\Product;

use App\Jobs\SellerAccount\JobDeleteUnsoldAccount;
use App\Jobs\SellerAccount\JobImportAccount;
use App\Models\Mongo\Accounts;
use App\Models\Mongo\ImportAccountHistory;
use Carbon\Carbon;
use Config;
use Illuminate\Support\Facades\Cache;
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
            ->with('order:_id,order_number')
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function getById($id, $select = ['*'], $relation = [])
    {
        return Accounts::select($select)->with($relation)->where('_id', $id)->first();
    }

    public function getTagAccountCache($subProductId)
    {
        return "seller_accounts_{$subProductId}";
    }

    public function clearSubProductAccountCache($subProductId)
    {
        $tagCache = $this->getTagAccountCache($subProductId);
        Cache::tags($tagCache)->flush();
    }

    public function processAccountFile($data, $typeName)
    {
        $inputMethod = $data['input_method'] ?? Accounts::INPUT_METHOD['FILE'];
        $host = request()->getHost();
        $dbConfig = Config::get('database.connections.tenant_mongo');

        if ($inputMethod === Accounts::INPUT_METHOD['FILE']) {
            $file = $data['file'];
            $fileName = 'accounts_' . time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs("{$host}/accounts", $fileName, 'public');
            $importAccountHistory = $this->createImportAccountHistory($data['sub_product_id'], $filePath);
            dispatch(new JobImportAccount($filePath, $data['product_id'], $data['sub_product_id'], $importAccountHistory?->id, $typeName, $dbConfig, Accounts::INPUT_METHOD['FILE']));
        } elseif ($inputMethod === Accounts::INPUT_METHOD['TEXTAREA']) {
            $content = $data['content'];
            $fileName = 'input_accounts_' . time() . '.txt';
            $filePath = "{$host}/accounts/{$fileName}";
            Storage::disk('public')->put($filePath, $content);
            $importAccountHistory = $this->createImportAccountHistory($data['sub_product_id'], $filePath);
            dispatch(new JobImportAccount($filePath, $data['product_id'], $data['sub_product_id'], $importAccountHistory?->id, $typeName, $dbConfig, Accounts::INPUT_METHOD['TEXTAREA']));
        }
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
        $subProductService = new SubProductService;
        $subProductService->updateSubProductQuantityWithCount($subProductId);
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
        dispatch(new JobDeleteUnsoldAccount($subProductId, Config::get('database.connections.tenant_mongo')));
    }

    public function getStatusOptions($subProductId, $searchTerm = '', int $page = 1, int $perPage = 10)
    {
        $tagCache = $this->getTagAccountCache($subProductId);
        $cacheKey = 'account_status_options_' . md5("{$searchTerm}_{$page}_{$perPage}");

        return Cache::tags($tagCache)->remember($cacheKey, now()->addMinutes(30), function () use ($searchTerm, $page, $perPage, $subProductId) {
            $query = Accounts::select('status')
                ->whereNotNull('status')
                ->where('sub_product_id', $subProductId)
                ->groupBy('status');

            if (!empty($searchTerm)) {
                $query->where('status', 'like', '%' . $searchTerm . '%');
            }

            $paginatedResults = $query->orderBy('status')
                ->paginate($perPage, ['*'], 'page', $page);

            $statusOptions = collect([]);
            if ($page == 1) {
                $statusOptions->push([
                    'value' => '',
                    'label' => 'All',
                ]);
            }

            $statusData = $paginatedResults->map(
                fn($item) => [
                    'value' => $item->status,
                    'label' => $item->status,
                ]
            );

            $statusOptions = $statusOptions->merge($statusData);

            return [
                'results' => $statusOptions,
                'has_more' => $paginatedResults->hasMorePages(),
            ];
        });
    }
}
