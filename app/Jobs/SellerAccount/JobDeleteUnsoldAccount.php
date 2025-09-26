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

class JobDeleteUnsoldAccount implements ShouldBeUnique, ShouldQueue
{
    use Queueable;

    protected $subProductId;

    protected $dbConfig;

    protected $accountService;

    public $uniqueFor = 3600;

    /**
     * Create a new job instance.
     */
    public function __construct($subProductId, $dbConfig)
    {
        $this->dbConfig = $dbConfig;
        $this->subProductId = $subProductId;
        $this->accountService = new SellerAccountService;
        $this->queue = 'process_seller_account';
    }

    public function uniqueId(): string
    {
        return 'process_delete_unsold_account_'.$this->subProductId;
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
            // echo "Start delete unsold account for sub_product_id {$this->subProductId}".PHP_EOL;
            $this->accountService->deleteUnsoldAccounts($this->subProductId);
            // echo "Finished delete unsold account for sub_product_id {$this->subProductId}".PHP_EOL;
        } catch (Exception $e) {
            // echo 'Error processing delete unsold account: '.$e->getMessage().PHP_EOL;
            throw $e;
        }
    }

    public function failed(Exception $exception): void
    {
        // echo 'Job delete unsold account failed: '.$exception->getMessage().PHP_EOL;
    }
}
