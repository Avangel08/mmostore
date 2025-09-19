<?php

use App\Console\Commands\Systems\CheckBank;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

/*
|--------------------------------------------------------------------------
| Console Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of your Closure based console
| commands. Each Closure is bound to a command instance allowing a
| simple approach to interacting with each command's IO methods.
|
*/

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

$pathLogs = storage_path('logs' . DIRECTORY_SEPARATOR . date('Ymd'));
if (!is_dir($pathLogs)) {
  mkdir($pathLogs, 0777, true);
}

Schedule::command(CheckBank::class)
  ->everyMinute()
  ->withoutOverlapping(10)
  ->runInBackground()
  ->appendOutputTo($pathLogs . '/check_bank.txt');