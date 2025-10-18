<?php

namespace App\Console\Commands\SePay;

use App\Models\MySQL\Banks;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;

class GetListBank extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sepay:get-list-bank';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Lấy danh sách ngân hàng từ SePay';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $result = Http::get('https://qr.sepay.vn/banks.json');

        if($result->successful()){
            $data = $result->json();
            $total = 0;
            if($data['data']){
                foreach ($data['data'] as $key => $value) {
                    $bank = Banks::where('code', $value['code'])->first();
                    if(!$bank){
                        Banks::create([
                            'name' => $value['name'],
                            'code' => $value['code'],
                            'bin' => $value['bin'],
                            'short_name' => $value['short_name'],
                            'supported' => $value['supported'],
                            'status' => Banks::STATUS['ACTIVE'],
                        ]);
                    }
                    else{
                        $bank->update([
                            'name' => $value['name'],
                            'code' => $value['code'],
                            'bin' => $value['bin'],
                            'short_name' => $value['short_name'],
                            'supported' => $value['supported'],
                            'status' => Banks::STATUS['ACTIVE'],
                        ]);
                    }
                    $total++;
                };

            }
            $this->info('Đã lấy danh sách ngân hàng từ SePay: ' . $total);
        }
        return $this->info("get list bank success: " . Carbon::now()->toDateTimeString());
    }
}
