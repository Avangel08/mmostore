<?php

namespace App\Console\Commands\Systems;

use App\Jobs\Systems\JobCheckBankAdmin;
use App\Jobs\Systems\JobCheckBankUser;
use App\Models\MySQL\PaymentMethods;
use Illuminate\Console\Command;

class CheckBank extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'system:check-bank';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check bank admin and user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("Start checking bank");
        PaymentMethods::where("type", PaymentMethods::TYPE["BANK"])->where('status', PaymentMethods::STATUS["ACTIVE"])->cursor()->each(function ($item) {
            if(empty($item->user) && $item->user_type == PaymentMethods::USER_TYPE["ADMIN"]){
                // JobCheckBankAdmin::dispatch($item->id);
            }else{
                JobCheckBankUser::dispatch($item->id);
            }
        });
       return $this->info("End checking bank");
    }
}
