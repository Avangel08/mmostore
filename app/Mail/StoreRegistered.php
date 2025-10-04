<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class StoreRegistered extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * The payload to render inside the email.
     *
     * @var array<string, mixed>
     */
    public array $payload;

    /**
     * Create a new message instance.
     */
    public function __construct(array $payload)
    {
        $this->payload = $payload;
    }

    /**
     * Build the message.
     */
    public function build(): self
    {
        return $this
            ->subject('Đăng ký cửa hàng thành công')
            ->view('emails.store_registered')
            ->with($this->payload);
    }
}


