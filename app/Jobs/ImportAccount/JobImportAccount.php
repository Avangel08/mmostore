<?php

namespace App\Jobs\ImportAccount;

use App\Models\Mongo\Accounts;
use App\Models\Mongo\ImportAccountHistory;
use App\Services\Product\SellerAccountService;
use Carbon\Carbon;
use Config;
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
        $this->queue = 'process_import_account';
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
            Config::set('database.connections.tenant_mongo', $this->dbConfig);
            $chunkSize = 1000;
            $fullPath = Storage::disk('public')->path($this->filePath);
            $timeStart = now();
            $listKey = [];
            $result = $this->processChunk($chunkSize, $fullPath, $timeStart, $listKey);
            $importAccountHistory = ImportAccountHistory::findOrFail($this->importHistoryId);
            $importAccountHistory->update([
                'status' => ImportAccountHistory::STATUS['FINISH'],
                'result' => $result,
                'ended_at' => now(),
            ]);
            $this->deleteOldAccount($timeStart, $listKey);
        } catch (Exception $e) {
            echo 'Error processing import account: '.$e->getMessage().PHP_EOL;
            $importAccountHistory->update([
                'status' => ImportAccountHistory::STATUS['ERROR'],
                'ended_at' => now(),
            ]);
            throw $e;
        }
    }

    public function deleteOldAccount(Carbon $timeStart, $listKey)
    {
        return Accounts::where('sub_product_id', $this->subProductId)
            ->where('status', Accounts::STATUS['LIVE'])
            ->whereIn('key', array_keys($listKey))
            ->where('created_at', '!=', new \MongoDB\BSON\UTCDateTime($timeStart))
            ->delete();
    }

    public function processChunk($chunkSize, $fullPath, Carbon $timeStart, &$listKey)
    {
        $totalCount = 0;
        $successCount = 0;
        $errorCount = 0;
        $errors = [];

        LazyCollection::make(function () use ($fullPath) {
            $handle = fopen($fullPath, 'r');
            while (($line = fgets($handle)) !== false) {
                yield $line;
            }
            fclose($handle);
        })
            ->map(function ($line) use (&$totalCount, &$successCount, &$errorCount, &$errors, $timeStart, &$listKey) {
                $totalCount++;
                $line = trim($line);
                if (empty($line)) {
                    $errorCount++;
                    $errors[] = "Line {$totalCount} is empty: ".$line;

                    return null;
                }

                $parts = explode('|', $line);
                if (count($parts) < 2) {
                    $errorCount++;
                    $errors[] = "Line {$totalCount} does not have enough parts: ".$line;

                    return null;
                }

                $key = trim($parts[0]);
                if (empty($key)) {
                    $errorCount++;
                    $errors[] = "Line {$totalCount} has an empty key: ".$line;

                    return null;
                }
                $listKey[$key] = $key;

                $dataParts = array_slice($parts, 1);
                foreach ($dataParts as $part) {
                    if (trim($part) === '') {
                        $errorCount++;
                        $errors[] = "Line {$totalCount} has empty data parts: ".$line;

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
                }
                unset($data);
            });

        return [
            'total_count' => $totalCount,
            'success_count' => $successCount,
            'error_count' => $errorCount,
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
}
