<?php

namespace App\Console;

use App\Console\Commands\Systems\CheckBankAdmin;
use App\Console\Commands\Systems\CheckBankSeller;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }

    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        $pathLogs = storage_path('logs' . DIRECTORY_SEPARATOR . date('Ymd'));
        if (!is_dir($pathLogs)) {
            mkdir($pathLogs, 0777, true);
        }

        $schedule->command(CheckBankAdmin::class)
            ->everyMinute()
            ->withoutOverlapping(10)
            ->runInBackground()
            ->appendOutputTo($pathLogs . '/check_bank_admin.txt');

        $schedule->command(CheckBankSeller::class)
            ->everyMinute()
            ->withoutOverlapping(10)
            ->runInBackground()
            ->appendOutputTo($pathLogs . '/check_bank_seller.txt');
    }
}
