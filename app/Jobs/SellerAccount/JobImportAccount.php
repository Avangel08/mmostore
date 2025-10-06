<?php

namespace App\Jobs\SellerAccount;

use App\Models\Mongo\Accounts;
use App\Models\Mongo\ImportAccountHistory;
use App\Services\Product\SellerAccountService;
use App\Services\Product\SubProductService;
use Carbon\Carbon;
use Config;
use DB;
use Exception;
use Illuminate\Cache\Repository;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\LazyCollection;
use Storage;

class JobImportAccount implements ShouldBeUnique, ShouldQueue
{
    use Queueable;

    protected $filePath;

    protected $productId;

    protected $subProductId;

    protected $categoryId;

    protected $productTypeId;

    protected $accountService;

    protected $subProductService;

    protected $importHistoryId;

    protected $dbConfig;

    protected $cacheTag;

    public $uniqueFor = 3600;

    /**
     * Create a new job instance.
     */
    public function __construct($filePath, $productId, $subProductId, $categoryId, $productTypeId, $importHistoryId, $dbConfig)
    {
        $this->filePath = $filePath;
        $this->productId = $productId;
        $this->subProductId = $subProductId;
        $this->categoryId = $categoryId;
        $this->productTypeId = $productTypeId;
        $this->importHistoryId = $importHistoryId;
        $this->dbConfig = $dbConfig;
        $this->accountService = new SellerAccountService;
        $this->subProductService = new SubProductService;
        $this->cacheTag = 'import_account_' . $this->importHistoryId;
        $this->queue = 'process_seller_account';
    }

    public function uniqueId(): string
    {
        return 'process_import_account_' . $this->importHistoryId;
    }

    public function uniqueVia(): Repository
    {
        return Cache::driver('redis');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // DB::beginTransaction();
            // echo "Start processing import account for sub_product_id {$this->subProductId}".PHP_EOL;
            Config::set('database.connections.tenant_mongo', $this->dbConfig);
            $chunkSize = 1000;
            $fullPath = Storage::disk('public')->path($this->filePath);
            $timeStart = now();
            $importAccountHistory = ImportAccountHistory::findOrFail($this->importHistoryId);
            $maxChunkIndex = 0;
            $result = $this->processChunk($chunkSize, $fullPath, $timeStart, $maxChunkIndex);
            $importAccountHistory->update([
                'status' => ImportAccountHistory::STATUS['FINISH'],
                'result' => $result,
                'ended_at' => now(),
            ]);
            // echo "Finished processing import account for sub_product_id {$this->subProductId}: {$result['total_count']} total, {$result['success_count']} success, {$result['error_count']} errors".PHP_EOL;
            // echo 'Deleting old accounts...'.PHP_EOL;
            $this->deleteOldAccountByChunk($timeStart, $maxChunkIndex);
            $this->updateSubProductQuantity();
            // echo 'Delete old accounts done.'.PHP_EOL;
            // DB::commit();
        } catch (Exception $e) {
            // DB::rollBack();
            // echo 'Error processing import account: '.$e->getMessage().PHP_EOL;
            $importAccountHistory->update([
                'status' => ImportAccountHistory::STATUS['ERROR'],
                'ended_at' => now(),
            ]);
            throw $e;
        } finally {
            Cache::tags($this->cacheTag)->flush();
            // echo 'Cleared cache for tag '.$this->cacheTag.PHP_EOL;
        }
    }

    public function processChunk($chunkSize, $fullPath, Carbon $timeStart, int &$maxChunkIndex): array
    {
        $totalCount = 0;
        $successCount = 0;
        $errorCount = 0;

        LazyCollection::make(function () use ($fullPath) {
            $handle = fopen($fullPath, 'r');
            while (($line = fgets($handle)) !== false) {
                yield $line;
            }
            fclose($handle);
        })
            ->map(function ($line) use (&$totalCount, &$successCount, &$errorCount, $timeStart) {
                $totalCount++;
                $line = trim($line);
                if (empty($line)) {
                    $errorCount++;
                    return null;
                }

                $parts = explode('|', $line);
                if (count($parts) < 2) {
                    $errorCount++;
                    return null;
                }

                $status = Accounts::STATUS['LIVE'];
                $dataParts = [];
                $explodedFirstPart = explode(':', trim($parts[0] ?? ''));
                $isStatusSection = $this->checkFirstPartIsStatus($explodedFirstPart);
                if ($isStatusSection && empty(trim($explodedFirstPart[1] ?? ''))) {
                    $explodedFirstPart[1] = Accounts::STATUS['LIVE'];
                }

                $status = strtoupper($isStatusSection ? trim($explodedFirstPart[1] ?? '') : Accounts::STATUS['LIVE']);
                $key = strtolower(trim($parts[$isStatusSection ? 1 : 0] ?? ''));
                $dataParts = array_slice($parts, $isStatusSection ? 2 : 1);

                if (empty($key)) {
                    $errorCount++;
                    return null;
                }

                if (empty($dataParts)) {
                    $errorCount++;
                    return null;
                }

                foreach ($dataParts as $part) {
                    if (trim($part) === '') {
                        $errorCount++;
                        return null;
                    }
                }

                unset($line);

                $mainData = $dataParts[0];
                $dataCacheKey = $this->getInsertDataCache($mainData);
                if (!Cache::tags($this->cacheTag)->add($dataCacheKey, true, now()->endOfDay())) {
                    $errorCount++;
                    return null;
                }

                return [
                    'key' => (string) $key,
                    'data' => (string) implode('|', array_map('trim', $dataParts)),
                    'main_data' => (string) $mainData,
                    'status' => (string) $status,
                    'product_id' => (string) $this->productId,
                    'sub_product_id' => (string) $this->subProductId,
                    'category_id' => (string) $this->categoryId,
                    'product_type_id' => (int) $this->productTypeId,
                    'note' => null,
                    'customer_id' => null,
                    'order_id' => null,
                    'created_at' => $timeStart,
                    'updated_at' => $timeStart,
                    'import_account_history_id' => (string) $this->importHistoryId,
                ];
            })
            ->filter()
            ->chunk($chunkSize)
            ->each(function (LazyCollection $data, $chunkIndex) use (&$successCount, &$errorCount, &$maxChunkIndex) {
                $maxChunkIndex = $chunkIndex;
                $listCheckUniqueData = $this->accountService->checkUniqueData($this->categoryId, $this->productTypeId, $data->pluck('main_data')->all());

                $filteredData = $data->filter(function ($item) use ($listCheckUniqueData, &$errorCount) {
                    $isUniqueData = $listCheckUniqueData[$item['main_data']] ?? false;
                    if (!$isUniqueData) {
                        $dataCacheKey = $this->getInsertDataCache($item['main_data']);
                        Cache::tags($this->cacheTag)->add($dataCacheKey, true, now()->endOfDay());
                    }
                    return $isUniqueData;
                });

                $keysCache = $this->getInsertKeyCache($chunkIndex);
                $allKey = $filteredData->pluck('key')->all();
                Cache::tags($this->cacheTag)->put($keysCache, $allKey, now()->endOfDay());

                $originalDataCount = $data->count();
                $filteredDataCount = $filteredData->count();
                $cannotInsertCount = $originalDataCount - $filteredDataCount;
                $errorCount += $cannotInsertCount;

                $isSuccess = $this->processInsert($filteredData);
                $dataCount = $filteredDataCount;
                if ($isSuccess) {
                    $successCount += $dataCount;
                } else {
                    $errorCount += $dataCount;
                }
                unset($data);
            });

        return [
            'total_count' => (int) $totalCount,
            'success_count' => (int) $successCount,
            'error_count' => (int) $errorCount,
        ];
    }

    public function processInsert(LazyCollection $data): bool
    {
        $accountData = $data->values()->all();
        if (!empty($accountData)) {
            return Accounts::insert($accountData);
        }

        return false;
    }

    public function checkFirstPartIsStatus(array &$explodedParts)
    {
        if (count($explodedParts) != 2) {
            return false;
        }

        if (strtolower(trim($explodedParts[0] ?? '')) != 'status') {
            return false;
        }

        return true;
    }

    public function failed(Exception $exception): void
    {
        // echo 'Job failed: '.$exception->getMessage().PHP_EOL;
        $importAccountHistory = ImportAccountHistory::findOrFail($this->importHistoryId);
        $importAccountHistory->update([
            'status' => ImportAccountHistory::STATUS['ERROR'],
            'ended_at' => now(),
        ]);
    }

    public function updateSubProductQuantity()
    {
        $totalProduct = $this->accountService->getUnsoldAccountCountBySubProductId($this->subProductId);
        $this->subProductService->updateSubProductQuantity($this->subProductId, $totalProduct);
    }

    public function getInsertKeyCache(int $maxChunkIndex): string
    {
        return $this->cacheTag . '_keys-chunk_' . $maxChunkIndex;
    }

    public function getInsertDataCache($data): string
    {
        return $this->cacheTag . '_data_' . $data;
    }

    public function deleteOldAccountByChunk(Carbon $timeStart, int $maxChunkIndex)
    {
        for ($chunkIndex = 0; $chunkIndex <= $maxChunkIndex; $chunkIndex++) {
            $keysDataFromCache = $this->getInsertKeyCache($chunkIndex);
            $keysDataToDelete = Cache::tags($this->cacheTag)->get($keysDataFromCache, []);
            if (!empty($keysDataToDelete)) {
                $this->accountService->deleteOldAccounts($timeStart, $keysDataToDelete, $this->subProductId);
            }
        }
    }
}
