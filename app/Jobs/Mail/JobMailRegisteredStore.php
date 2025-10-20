<?php

namespace App\Jobs\Mail;

use App\Mail\StoreRegisteredMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Mail;

class JobMailRegisteredStore implements ShouldQueue
{
    use Queueable;
    public $data;
    public $locale;
    /**
     * Create a new job instance.
     */
    public function __construct($data, $locale = 'en')
    {
        $this->data = $data;
        $this->locale = $locale;
        $this->queue = "mail_registered_store";
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Mail::to($this->data['email'])->locale($this->locale)->send(new StoreRegisteredMail($this->data));
    }
}
