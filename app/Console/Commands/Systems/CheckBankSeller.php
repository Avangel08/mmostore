<?php

namespace App\Console\Commands\Systems;

use App\Jobs\Systems\JobCheckBankUser;
use App\Models\Mongo\PaymentMethodSeller;
use App\Models\MySQL\Stores;
use App\Services\Tenancy\TenancyService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CheckBankSeller extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'systems:check-bank-seller';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle(TenancyService $tenancyService)
    {
        $this->info("Start checking bank");
        $total = 0;
        $listStore = Stores::where("status", Stores::STATUS['ACTIVE'])->cursor();
        foreach ($listStore as $store) {
            $connect = $tenancyService->buildConnectionFromStore($store);
            $tenancyService->applyConnection($connect);
            PaymentMethodSeller::where('status', PaymentMethodSeller::STATUS["ACTIVE"])
                ->where("type", PaymentMethodSeller::TYPE['BANK'])
                ->where('is_verify_otp', true)
                ->cursor()->each(function ($item) use ($store) {
                    JobCheckBankUser::dispatch($item->id, $store->id);
                });
            $total++;
        }
        $this->warn("Total Seller: " . $total);
        return $this->info("End checking bank Time-" . Carbon::now()->toDateTimeString());
    }
}
