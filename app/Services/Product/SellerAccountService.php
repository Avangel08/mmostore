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
            ->filterOrderNumber($request)
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

        $productId = $data['product_id'];
        $subProductId = $data['sub_product_id'];

        if ($inputMethod === Accounts::INPUT_METHOD['FILE']) {
            $this->handleFileImport($data['file'], $productId, $subProductId, $typeName);
        } elseif ($inputMethod === Accounts::INPUT_METHOD['TEXTAREA']) {
            $this->handleRawContentImport($data['content'], $productId, $subProductId, $typeName);
        }
    }

    public function handleFileImport($file, $productId, $subProductId, $typeName)
    {
        $host = request()->getHost();
        $dbConfig = Config::get('database.connections.tenant_mongo');

        $fileName = 'accounts_' . time() . '_' . $file->getClientOriginalName();
        $filePath = $file->storeAs("{$host}/accounts", $fileName, 'local');
        $importAccountHistory = $this->createImportAccountHistory($subProductId, $filePath);
        dispatch(new JobImportAccount($filePath, $productId, $subProductId, $importAccountHistory?->id, $typeName, $dbConfig));
    }

    public function handleRawContentImport($content, $productId, $subProductId, $typeName, bool $isSync = false)
    {
        $host = request()->getHost();
        $dbConfig = Config::get('database.connections.tenant_mongo');

        $fileName = 'input_accounts_' . time() . '.txt';
        $filePath = "{$host}/accounts/{$fileName}";
        Storage::disk('local')->put($filePath, $content);
        $importAccountHistory = $this->createImportAccountHistory($subProductId, $filePath);

        $jobImport = new JobImportAccount($filePath, $productId, $subProductId, $importAccountHistory?->id, $typeName, $dbConfig);
        if ($isSync) {
            $result = app()->call([$jobImport, 'handle']);
            return $result;
        }
        dispatch($jobImport);
    }

    public function processApiAccount($content, $productId, $subProductId, $typeName)
    {
        return $this->handleRawContentImport($content, $productId, $subProductId, $typeName, true);
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
        $limit = 1000;
        do {
            $deletedCount = Accounts::where('sub_product_id', $subProductId)
                ->whereNull('order_id')
                ->whereIn('key', $listKey)
                ->where('created_at', '<', new \MongoDB\BSON\UTCDateTime($timeStart))
                ->limit($limit)
                ->forceDelete();
        } while ($deletedCount > 0);
    }

    public function deleteUnsoldAccounts($subProductId)
    {
        // DB::transaction(function () use ($subProductId) {
        $limit = 1000;
        $totalDeleted = 0;
        do {
            $deletedCount = Accounts::where('sub_product_id', $subProductId)
                ->whereNull('order_id')
                ->limit($limit)
                ->forceDelete();
            $totalDeleted += $deletedCount;
        } while ($deletedCount > 0);
        app(SubProductService::class)->updateSubProductQuantityWithCount($subProductId);
        return $totalDeleted;
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

    public function startDeleteAllUnsoldAccount($subProductId, $isSync = false)
    {
        $dbConfig = Config::get('database.connections.tenant_mongo');
        $jobDeleteUnsoldAccount = new JobDeleteUnsoldAccount($subProductId, $dbConfig);
        if ($isSync) {
            return app()->call([$jobDeleteUnsoldAccount, 'handle']) ?? 0;
        }
        dispatch($jobDeleteUnsoldAccount);
    }

    public function deleteListAccount($subProductId, $listAccounts)
    {
        $limit = 1000;
        $totalCount = count($listAccounts ?? []);
        $successCount = 0;
        do {
            $deletedCount = Accounts::where('sub_product_id', $subProductId)
                ->whereIn('data', $listAccounts)
                ->whereNull('order_id')
                ->limit($limit)
                ->forceDelete();
            $successCount += $deletedCount;
        } while ($deletedCount > 0);
        app(SubProductService::class)->updateSubProductQuantityWithCount($subProductId);
        $errorCount = $totalCount - $successCount;
        $responseData = [
            'total_count' => $totalCount,
            'success_count' => $successCount,
            'error_count' => $errorCount < 0 ? 0 : $errorCount,
        ];
        if ($errorCount > 0) {
            $responseData['reason_error'] = "Could not delete not existing or sold accounts";
        }
        return $responseData;
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
            if ($page == 1 && empty($searchTerm)) {
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
