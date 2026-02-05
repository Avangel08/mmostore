<?php

namespace App\Rules;

use App\Models\Mongo\PaymentMethodSeller;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class UniquePaymentMethodSellerRule implements ValidationRule
{
    protected $type;
    protected $excludeId;

    public function __construct($type, $excludeId = null)
    {
        $this->type = $type;
        $this->excludeId = $excludeId;
    }

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $query = PaymentMethodSeller::where('key', $value)
            ->where('type', intval($this->type));
        if ($this->excludeId) {
            $query->where('_id', '!=', $this->excludeId);
        }
        $exists = $query->exists();
        if ($exists) {
            $fail('This payment method already exists.');
        }
    }
}
