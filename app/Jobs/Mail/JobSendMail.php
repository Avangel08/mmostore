<?php

namespace App\Jobs\Mail;

use App\Mail\BuyerResetPasswordMail;
use App\Mail\SellerResetPasswordMail;
use App\Mail\StoreRegisteredMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Mail;

enum MailType: string
{
    case REGISTERED_STORE = 'registered_store';
    case BUYER_RESET_PASSWORD = 'buyer_reset_password';
    case SELLER_RESET_PASSWORD = 'seller_reset_password';
}

class JobSendMail implements ShouldQueue
{
    use Queueable;

    public $data;
    public $locale;
    public $mailType;

    public function __construct(MailType $mailType, $data, $locale = 'en')
    {
        $this->mailType = $mailType;
        $this->data = $data;
        $this->locale = $locale;
        $this->queue = "mail_send";
    }

    public function handle(): void
    {
        $mailClass = $this->getMailClass();
        Mail::to($this->data['email'])->locale($this->locale)->send(new $mailClass($this->data));
    }

    private function getMailClass(): string
    {
        return match ($this->mailType) {
            MailType::REGISTERED_STORE => StoreRegisteredMail::class,
            MailType::BUYER_RESET_PASSWORD => BuyerResetPasswordMail::class,
            MailType::SELLER_RESET_PASSWORD => SellerResetPasswordMail::class,
        };
    }

}
