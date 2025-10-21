<?php

namespace App\Console\Commands;

use App\Models\Mongo\Accounts;
use App\Services\Home\StoreService;
use App\Services\Tenancy\TenancyService;
use Illuminate\Console\Command;

class CleanupStaleReservations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cleanup:stale-reservations';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cleanup stale account reservations older than 10 minutes';

    /**
     * Execute the console command.
     */
    public function handle(
        StoreService $storeService,
        TenancyService $tenancyService
    ) {
        $this->info('Starting cleanup of stale reservations...');
        
        $totalCleaned = 0;
        
        try {
            $stores = $storeService->getAll();
            
            foreach ($stores as $store) {
                try {
                    $this->info("Processing store: {$store->name}");
                    
                    $connection = $tenancyService->buildConnectionFromStore($store);
                    $tenancyService->applyConnection($connection, true);
                    
                    $cleanedCount = $this->cleanupStaleReservationsForStore();
                    $totalCleaned += $cleanedCount;
                    
                    $this->info("Cleaned {$cleanedCount} stale reservations for store: {$store->name}");
                    
                } catch (\Throwable $th) {
                    $this->error("Failed to process store {$store->name}: " . $th->getMessage());
                    continue;
                }
            }
            
            $this->info("Cleanup completed. Total cleaned: {$totalCleaned} stale reservations.");
            
        } catch (\Exception $e) {
            $this->error("Cleanup failed: " . $e->getMessage());
            return 1;
        }
        
        return 0;
    }

    private function cleanupStaleReservationsForStore(): int
    {
        $staleTime = now()->subMinutes(10); // 10 minutes timeout

        $staleAccounts = Accounts::whereNotNull('reserved_at')
            ->where('reserved_at', '<', $staleTime)
            ->where('status', Accounts::STATUS['SOLD'])
            ->whereNotNull('customer_id')
            ->whereNotNull('order_id')
            ->get();

        $cleanedCount = 0;
        
        foreach ($staleAccounts as $account) {
            try {
                $account->update([
                    'customer_id' => null,
                    'order_id' => null,
                    'status' => Accounts::STATUS['LIVE'],
                    'reserved_at' => null,
                    'reserved_by_job' => null
                ]);
                
                $cleanedCount++;
            } catch (\Exception $e) {
                continue;
            }
        }
        
        return $cleanedCount;
    }
}
