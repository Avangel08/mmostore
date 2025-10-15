<?php

namespace App\Jobs\SellerAccount;

use App\Services\Product\SellerAccountService;
use Config;
use Exception;
use Illuminate\Cache\Repository;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;
use Throwable;

class JobDeleteUnsoldAccount implements ShouldBeUnique, ShouldQueue
{
    use Queueable;

    protected $subProductId;

    protected $dbConfig;

    public $uniqueFor = 3600;

    /**
     * Create a new job instance.
     */
    public function __construct($subProductId, $dbConfig)
    {
        $this->dbConfig = $dbConfig;
        $this->subProductId = $subProductId;
        $this->queue = 'process_seller_account';
    }

    public function uniqueId(): string
    {
        return 'process_delete_unsold_account_' . $this->subProductId;
    }

    public function uniqueVia(): Repository
    {
        return Cache::driver('redis');
    }

    /**
     * Execute the job.
     */
    public function handle(SellerAccountService $accountService): void
    {
        try {
            Config::set('database.connections.tenant_mongo', $this->dbConfig);
            // echo "Start delete unsold account for sub_product_id {$this->subProductId}".PHP_EOL;
            $accountService->clearSubProductAccountCache($this->subProductId);
            $accountService->deleteUnsoldAccounts($this->subProductId);
            // echo "Finished delete unsold account for sub_product_id {$this->subProductId}".PHP_EOL;
        } catch (Exception $e) {
            // echo 'Error processing delete unsold account: '.$e->getMessage().PHP_EOL;
            throw $e;
        }
    }

    public function failed(Throwable $exception): void
    {
        // echo 'Job delete unsold account failed: '.$exception->getMessage().PHP_EOL;
    }
}
