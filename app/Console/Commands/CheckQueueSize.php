<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Queue;

class CheckQueueSize extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'systems:check_queue_size';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check queue size';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $listQueue = [
            'default',
        ];
        foreach ($listQueue as $queue) {
            echo $queue . ' : ' . Queue::size($queue) . PHP_EOL;
        }
        return $this->info($this->description . ' - Time: ' . Carbon::now());
    }
}
