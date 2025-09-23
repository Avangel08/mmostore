<?php

namespace App\Jobs\ImportAccount;

use App\Models\Mongo\Accounts;
use Config;
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

    protected $dbConfig;

    public $uniqueFor = 3600;

    /**
     * Create a new job instance.
     */
    public function __construct($filePath, $productId, $subProductId, $dbConfig)
    {
        $this->filePath = $filePath;
        $this->productId = $productId;
        $this->subProductId = $subProductId;
        $this->dbConfig = $dbConfig;
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
        Config::set('database.connections.tenant_mongo', $this->dbConfig);
        $fullPath = Storage::disk('public')->path($this->filePath);
        $chunkSize = 2;
        $this->deleteOldKeyAccount($chunkSize, $fullPath);
        $this->processChunk($chunkSize, $fullPath);
    }

    public function deleteOldKeyAccount($chunkSize, $fullPath)
    {
        LazyCollection::make(function () use ($fullPath) {
            $handle = fopen($fullPath, 'r');
            while (($line = fgets($handle)) !== false) {
                yield $line;
            }
            fclose($handle);
        })
            ->map(function ($line) {
                $parts = explode('|', trim($line), 2);
                $key = $parts[0] ?? null;

                return empty($key) ? null : $key;
            })
            ->filter()
            ->chunk($chunkSize)
            ->each(function (LazyCollection $keyChunk) {
                Accounts::where('sub_product_id', $this->subProductId)
                    ->whereIn('key', $keyChunk->values()->all())
                    ->delete();
            });
    }

    public function processChunk($chunkSize, $fullPath): void
    {
        LazyCollection::make(function () use ($fullPath) {
            $handle = fopen($fullPath, 'r');
            while (($line = fgets($handle)) !== false) {
                yield $line;
            }
            fclose($handle);
        })
            ->map(function ($line) {
                $line = trim($line);
                if (empty($line)) {
                    return null;
                }

                $parts = explode('|', $line);
                if (count($parts) < 2) {
                    return null;
                }

                $key = trim($parts[0]);
                if (empty($key)) {
                    return null;
                }

                $dataParts = array_slice($parts, 1);
                foreach($dataParts as $part) {
                    if (trim($part) === '') {
                        return null;
                    }
                }

                return [
                    'key' => $key,
                    'data' => implode('|', array_map('trim', $dataParts)),
                    'status' => Accounts::STATUS['LIVE'],
                    'product_id' => $this->productId,
                    'sub_product_id' => $this->subProductId,
                    'note' => null,
                    'customer_id' => null,
                    'order_id' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            })
            ->filter()
            ->chunk($chunkSize)
            ->each(function (LazyCollection $data) {
                $this->processInsert($data);
            });
    }

    protected function processInsert(LazyCollection $data): void
    {
        $accountData = $data->values()->all();

        if (! empty($accountData)) {
            Accounts::insert($accountData);
        }
    }
}
