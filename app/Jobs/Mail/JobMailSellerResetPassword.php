<?php

namespace App\Jobs\Mail;

use App\Mail\SellerResetPasswordMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Mail;

class JobMailSellerResetPassword implements ShouldQueue
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
        $this->queue = "mail_seller_reset_password";
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Mail::to($this->data['email'])->locale($this->locale)->send(new SellerResetPasswordMail($this->data));
    }
}
