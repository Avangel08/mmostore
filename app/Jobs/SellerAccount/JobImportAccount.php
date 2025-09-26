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

    protected $accountService;

    protected $subProductService;

    protected $importHistoryId;

    protected $dbConfig;

    public $uniqueFor = 3600;

    /**
     * Create a new job instance.
     */
    public function __construct($filePath, $productId, $subProductId, $importHistoryId, $dbConfig)
    {
        $this->filePath = $filePath;
        $this->productId = $productId;
        $this->subProductId = $subProductId;
        $this->importHistoryId = $importHistoryId;
        $this->dbConfig = $dbConfig;
        $this->accountService = new SellerAccountService;
        $this->subProductService = new SubProductService;
        $this->queue = 'process_seller_account';
    }

    public function uniqueId(): string
    {
        return 'process_import_account_'.md5($this->filePath);
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
            echo "Start processing import account for sub_product_id {$this->subProductId}".PHP_EOL;
            Config::set('database.connections.tenant_mongo', $this->dbConfig);
            $chunkSize = 1000;
            $fullPath = Storage::disk('public')->path($this->filePath);
            $timeStart = now();
            $listKey = [];
            $importAccountHistory = ImportAccountHistory::findOrFail($this->importHistoryId);
            $result = $this->processChunk($chunkSize, $fullPath, $timeStart, $listKey);
            $importAccountHistory->update([
                'status' => ImportAccountHistory::STATUS['FINISH'],
                'result' => $result,
                'ended_at' => now(),
            ]);
            echo "Finished processing import account for sub_product_id {$this->subProductId}: {$result['total_count']} total, {$result['success_count']} success, {$result['error_count']} errors".PHP_EOL;
            echo 'Deleting old accounts...'.PHP_EOL;
            $this->accountService->deleteOldAccounts($timeStart, array_keys($listKey), $this->subProductId);
            $this->updateSubProductQuantity();
            echo 'Delete old accounts done.'.PHP_EOL;
        } catch (Exception $e) {
            echo 'Error processing import account: '.$e->getMessage().PHP_EOL;
            $importAccountHistory->update([
                'status' => ImportAccountHistory::STATUS['ERROR'],
                'ended_at' => now(),
            ]);
            throw $e;
        }
    }

    public function processChunk($chunkSize, $fullPath, Carbon $timeStart, &$listKey)
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
            ->map(function ($line) use (&$totalCount, &$successCount, &$errorCount, $timeStart, &$listKey) {
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

                $key = trim($parts[0]);
                if (empty($key)) {
                    $errorCount++;

                    return null;
                }
                $listKey[$key] = $key;

                $dataParts = array_slice($parts, 1);
                foreach ($dataParts as $part) {
                    if (trim($part) === '') {
                        $errorCount++;
                        return null;
                    }
                }

                unset($line);

                return [
                    'key' => $key,
                    'data' => implode('|', array_map('trim', $dataParts)),
                    'status' => Accounts::STATUS['LIVE'],
                    'product_id' => $this->productId,
                    'sub_product_id' => $this->subProductId,
                    'note' => null,
                    'customer_id' => null,
                    'order_id' => null,
                    'created_at' => $timeStart,
                    'updated_at' => $timeStart,
                    'import_account_history_id' => $this->importHistoryId,
                ];
            })
            ->filter()
            ->chunk($chunkSize)
            ->each(function (LazyCollection $data, $index) use (&$successCount, &$errorCount, &$errors) {
                $isSuccess = $this->processInsert($data);
                $dataCount = $data->count();
                if ($isSuccess) {
                    $successCount += $dataCount;
                } else {
                    $errorCount += $dataCount;
                    $errors[] = "Failed to insert chunk {$index} of {$dataCount} records.";
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
        if (! empty($accountData)) {
            return Accounts::insert($accountData);
        }

        return false;
    }

    public function failed(Exception $exception): void
    {
        echo 'Job failed: '.$exception->getMessage().PHP_EOL;
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
}
