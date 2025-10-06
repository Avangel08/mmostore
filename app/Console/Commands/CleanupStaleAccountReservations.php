<?php

namespace App\Console\Commands;

use App\Models\Mongo\Accounts;
use App\Services\Tenancy\TenancyService;
use App\Services\Home\StoreService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CleanupStaleAccountReservations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'accounts:cleanup-stale-reservations {--minutes=10 : Minutes to consider as stale}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cleanup stale account reservations that are older than specified minutes';

    protected $tenancyService;
    protected $storeService;

    public function __construct(TenancyService $tenancyService, StoreService $storeService)
    {
        parent::__construct();
        $this->tenancyService = $tenancyService;
        $this->storeService = $storeService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $minutes = $this->option('minutes');
        $staleTime = now()->subMinutes($minutes);
        
        $this->info("Cleaning up stale reservations older than {$minutes} minutes...");
        
        // Lấy tất cả stores
        $stores = $this->storeService->getAllStores();
        $totalCleaned = 0;
        
        foreach ($stores as $store) {
            try {
                $connection = $this->tenancyService->buildConnectionFromStore($store);
                $this->tenancyService->applyConnection($connection, true);
                
                $staleAccounts = Accounts::whereNotNull('reserved_at')
                    ->where('reserved_at', '<', $staleTime)
                    ->where('status', Accounts::STATUS['SOLD'])
                    ->whereNotNull('customer_id')
                    ->whereNotNull('order_id')
                    ->get();
                
                $cleaned = 0;
                foreach ($staleAccounts as $account) {
                    $account->update([
                        'customer_id' => null,
                        'order_id' => null,
                        'status' => Accounts::STATUS['LIVE'],
                        'reserved_at' => null,
                        'reserved_by_job' => null
                    ]);
                    $cleaned++;
                }
                
                if ($cleaned > 0) {
                    $this->info("Store {$store->name}: Cleaned up {$cleaned} stale reservations");
                    $totalCleaned += $cleaned;
                }
                
            } catch (\Exception $e) {
                $this->error("Error processing store {$store->name}: " . $e->getMessage());
            }
        }
        
        $this->info("Total cleaned up: {$totalCleaned} stale reservations");
        
        return Command::SUCCESS;
    }
}
