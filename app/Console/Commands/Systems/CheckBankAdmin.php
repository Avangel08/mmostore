<?php

namespace App\Console\Commands\Systems;

use App\Jobs\Systems\JobCheckBankAdmin;
use App\Jobs\Systems\JobProcessPaymentPlan;
use App\Models\MySQL\PaymentMethods;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CheckBankAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'systems:check-bank-admin';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check bank admin';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("Start checking bank admin");
        PaymentMethods::where("type", PaymentMethods::TYPE["BANK"])
            ->where('status', PaymentMethods::STATUS["ACTIVE"])
            ->cursor()
            ->each(function ($item) {
                JobCheckBankAdmin::dispatch($item->id);
            });
        return $this->info("End checking bank admin Time-" . Carbon::now()->toDateTimeString());
    }
}
