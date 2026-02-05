<?php

namespace App\Jobs\SellerAccount;

use App\Services\Product\SellerAccountService;
use App\Services\Product\SubProductService;
use Config;
use Exception;
use Illuminate\Cache\Repository;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\LazyCollection;
use Throwable;

class JobDeleteOldAccount implements ShouldBeUnique, ShouldQueue
{
    use Queueable;

    protected $subProductId;

    protected $dbConfig;

    protected $uniqueKeys;

    protected $timeStart;

    public $uniqueFor = 3600;

    /**
     * Create a new job instance.
     */
    public function __construct($subProductId, $uniqueKeys, $timeStart, $dbConfig)
    {
        $this->subProductId = $subProductId;
        $this->uniqueKeys = $uniqueKeys;
        $this->timeStart = $timeStart;
        $this->dbConfig = $dbConfig;
        $this->queue = 'process_delete_old_account';
    }

    public function uniqueId(): string
    {
        return 'process_delete_old_account_' . now()->timestamp;
    }

    public function uniqueVia(): Repository
    {
        return Cache::driver('redis');
    }

    /**
     * Execute the job.
     */
    public function handle(SellerAccountService $accountService, SubProductService $subProductService): void
    {
        try {
            $chunkSize = 1000;
            Config::set('database.connections.tenant_mongo', $this->dbConfig);
            // echo "Start delete old account for sub_product_id {$this->subProductId}".PHP_EOL;
            LazyCollection::make($this->uniqueKeys)->chunk($chunkSize)->each(function (LazyCollection $keys) use ($accountService) {
                $accountService->deleteOldAccounts($this->timeStart, $keys->keys()->toArray(), $this->subProductId);
                unset($keys);
            });
            $subProductService->updateSubProductQuantityWithCount($this->subProductId);
            // echo "Finished delete old account for sub_product_id {$this->subProductId}".PHP_EOL;
        } catch (Exception $e) {
            // echo 'Error processing delete old account: '.$e->getMessage().PHP_EOL;
            throw $e;
        }
    }

    public function failed(Throwable $exception): void
    {
        // echo 'Job delete old account failed: '.$exception->getMessage().PHP_EOL;
    }
}
