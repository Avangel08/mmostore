<?php

namespace App\Rules;

use App\Models\MySQL\PaymentMethods;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class UniquePaymentMethodAdminRule implements ValidationRule
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
        $query = PaymentMethods::where('key', $value)
            ->where('type', intval($this->type));
        if ($this->excludeId) {
            $query->where('id', '!=', $this->excludeId);
        }
        $exists = $query->exists();
        if ($exists) {
            $fail('This payment method already exists.');
        }
    }
}
