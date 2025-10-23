<?php

namespace App\Jobs\SellerAccount;

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
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\LazyCollection;
use Throwable;

class JobImportAccount implements ShouldBeUnique, ShouldQueue
{
    use Queueable;

    protected $filePath;
    protected $productId;
    protected $subProductId;
    protected $importHistoryId;
    protected $typeName;
    protected $dbConfig;
    protected $uniqueKeys;
    public $uniqueFor = 3600;

    /**
     * Create a new job instance.
     */
    public function __construct($filePath, $productId, $subProductId, $importHistoryId, $typeName, $dbConfig)
    {
        $this->filePath = $filePath;
        $this->productId = $productId;
        $this->subProductId = $subProductId;
        $this->importHistoryId = $importHistoryId;
        $this->typeName = $typeName;
        $this->dbConfig = $dbConfig;
        $this->uniqueKeys = [];
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
    public function handle(
        SellerAccountService $accountService
    ) {
        try {
            // DB::beginTransaction();
            // echo "Start processing import account for sub_product_id {$this->subProductId}".PHP_EOL;
            $this->setMemoryLimit('2G');
            Config::set('database.connections.tenant_mongo', $this->dbConfig);
            $chunkSize = 1000;
            $fullPath = Storage::disk('local')->path($this->filePath);
            $timeStart = now();
            $importAccountHistory = ImportAccountHistory::findOrFail($this->importHistoryId);
            $accountService->clearSubProductAccountCache($this->subProductId);
            $result = $this->processChunk($chunkSize, $fullPath, $timeStart);
            $importAccountHistory->update([
                'status' => ImportAccountHistory::STATUS['FINISH'],
                'result' => $result,
                'ended_at' => now(),
            ]);
            // echo "Finished processing import account for sub_product_id {$this->subProductId}: {$result['total_count']} total, {$result['success_count']} success, {$result['error_count']} errors".PHP_EOL;
            // echo 'Deleting old accounts...'.PHP_EOL;
            if ($result['success_count'] > 0) {
                dispatch(new JobDeleteOldAccount($this->subProductId, $this->uniqueKeys, $timeStart, $this->dbConfig));
            }
            // echo 'Delete old accounts done.'.PHP_EOL;
            // DB::commit();
            return $result;
        } catch (Exception $e) {
            // DB::rollBack();
            // echo 'Error processing import account: '.$e->getMessage().PHP_EOL;
            $importAccountHistory->update([
                'status' => ImportAccountHistory::STATUS['ERROR'],
                'ended_at' => now(),
            ]);
            throw $e;
        } finally {
            unset($this->uniqueKeys);
            unset($result);
        }
    }

    public function processChunk($chunkSize, $fullPath, Carbon $timeStart): array
    {
        $totalCount = 0;
        $successCount = 0;
        $errorCount = 0;
        $errors = [];
        $data_errors = [];
        $isNeedCheckMail = str_contains(strtolower($this->typeName), 'mail');

        LazyCollection::make(function () use ($fullPath) {
            $handle = fopen($fullPath, 'r');
            while (($line = fgets($handle)) !== false) {
                yield $line;
            }
            fclose($handle);
        })
            ->map(function ($line) use (&$totalCount, &$successCount, &$errorCount, $timeStart, $isNeedCheckMail, &$errors, &$data_errors) {
                $totalCount++;
                $line = trim($line);
                if (empty($line)) {
                    $errorCount++;
                    $errors["Line {$totalCount}"] = 'Empty line';
                    $data_errors[] = $line;
                    return null;
                }

                $parts = explode('|', $line);
                if (count($parts) < 1) {
                    $errorCount++;
                    $errors["Line {$totalCount} ({$line})"] = 'Empty format';
                    $data_errors[] = $line;
                    return null;
                }

                $status = Accounts::STATUS['LIVE'];
                $remainData = [];
                $explodedFirstPart = explode(':', trim($parts[0] ?? ''));
                $isStatusSection = $this->checkFirstPartIsStatus($explodedFirstPart);
                if ($isStatusSection && empty(trim($explodedFirstPart[1] ?? ''))) {
                    $explodedFirstPart[1] = Accounts::STATUS['LIVE'];
                }

                $status = strtoupper($isStatusSection ? trim($explodedFirstPart[1] ?? '') : Accounts::STATUS['LIVE']);
                $mainData = strtolower(trim($parts[$isStatusSection ? 1 : 0] ?? ''));
                if (empty($mainData)) {
                    $errorCount++;
                    $errors["Line {$totalCount} ({$line})"] = 'Empty main data';
                    $data_errors[] = $line;
                    return null;
                }

                if ($isNeedCheckMail && !filter_var($mainData, FILTER_VALIDATE_EMAIL)) {
                    $errorCount++;
                    $errors["Line {$totalCount} ({$line})"] = 'Invalid email';
                    $data_errors[] = $line;
                    return null;
                }

                $key = $this->subProductId . '_' . $mainData;
                $remainData = array_slice($parts, $isStatusSection ? 2 : 1);

                foreach ($remainData as $remainPart) {
                    if (trim($remainPart) == '') {
                        $errorCount++;
                        $errors["Line {$totalCount} ({$line})"] = 'Empty remain data';
                        $data_errors[] = $line;
                        return null;
                    }
                }

                if (isset($this->uniqueKeys[$key])) {
                    $errorCount++;
                    $errors["Line {$totalCount} ({$line})"] = 'Duplicate data';
                    $data_errors[] = $line;
                    return null;
                }

                unset($line);
                $this->uniqueKeys[$key] = true;
                $dataAccount = (string) $mainData;

                if (!empty($remainData)) {
                    $dataAccount .= '|' . implode('|', array_map('trim', $remainData));
                }
                return [
                    'key' => (string) $key,
                    'data' => (string) $dataAccount,
                    'status' => (string) $status,
                    'product_id' => (string) $this->productId,
                    'sub_product_id' => (string) $this->subProductId,
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
            ->each(function (LazyCollection $data, $index) use (&$successCount, &$errorCount, &$errors) {
                $isSuccess = $this->processInsert($data);
                $dataCount = $data->count();
                if ($isSuccess) {
                    $successCount += $dataCount;
                } else {
                    $errorCount += $dataCount;
                    $errors["Batch of {$dataCount} accounts in chunk {$index}"] = 'Failed to insert';
                }
                unset($data);
            });

        return [
            'total_count' => (int) $totalCount,
            'success_count' => (int) $successCount,
            'error_count' => (int) $errorCount,
            'errors' => $errors,
            'data_errors' => $data_errors,
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

    public function failed(Throwable $exception): void
    {
        // echo 'Job failed: '.$exception->getMessage().PHP_EOL;
        $importAccountHistory = ImportAccountHistory::findOrFail($this->importHistoryId);
        $importAccountHistory->update([
            'status' => ImportAccountHistory::STATUS['ERROR'],
            'ended_at' => now(),
        ]);
        unset($this->uniqueKeys);
    }

    public function setMemoryLimit(string $limit)
    {
        ini_set('memory_limit', $limit);
    }
}
