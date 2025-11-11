<?php

namespace App\Console\Commands;

use App\Models\Mongo\Accounts;
use App\Models\MySQL\ReportAccountSeller;
use App\Models\MySQL\Stores;
use App\Services\Tenancy\TenancyService;
use Illuminate\Console\Command;

class ReportAccountSellerByAdmin extends Command
{
    protected $signature = 'systems:report-account-seller-by-admin';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Report account seller by admin';

    /**
     * Execute the console command.
     */
    public function handle(TenancyService $tenancyService)
    {
        $this->info("Starting report account seller by admin");

        try {
            $stores = Stores::where('status', Stores::STATUS['ACTIVE'])->get();

            foreach ($stores as $store) {
                try {
                    $this->info("Processing store ID: {$store->id}, Name: {$store->name}");

                    $connection = $tenancyService->buildConnectionFromStore($store);
                    $tenancyService->applyConnection($connection, true);

                    $liveCount = Accounts::where('status', Accounts::STATUS['LIVE'])
                        ->whereNull('order_id')
                        ->whereNull('deleted_at')
                        ->count();

                    $soldCount = Accounts::where(function ($query) {
                        $query->where('status', Accounts::STATUS['SOLD'])
                            ->orWhereNotNull('order_id');
                    })
                        ->whereNull('deleted_at')
                        ->count();

                    ReportAccountSeller::create([
                        'store_id' => $store->id,
                        'live_count' => $liveCount,
                        'sold_count' => $soldCount,
                        'recorded_at' => now(),
                    ]);

                    $this->info("Success store ID: {$store->id}, Name: {$store->name}, Live: {$liveCount}, Sold: {$soldCount}");
                } catch (\Exception $e) {
                    $this->info("Error store ID: {$store->id}, Name: {$store->name}, Error: " . $e->getMessage());
                    continue;
                }
            }

            $this->info("Aggregation completed successfully!");
        } catch (\Exception $e) {
            $this->error("Error aggregating account statistics: " . $e->getMessage());
            return 1;
        }

        return 0;
    }
}