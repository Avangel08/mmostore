<?php

namespace App\Http\Requests\Seller\Settings;

use App\Models\Mongo\Settings;
use App\Models\MySQL\Stores;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

use function PHPSTORM_META\map;

class SettingsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        foreach (['contacts', 'domains', 'notification'] as $key) {
            if (is_string($this->$key)) {
                $decoded = json_decode($this->$key, true);

                if (json_last_error() === JSON_ERROR_NONE) {
                    $this->merge([$key => $decoded]);
                }
            }
        }
    }


    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $action = $this->route()->getActionMethod();

        return match ($action) {
            'update' => $this->updateRules(),
            'store' => [
                'theme' => ['required', 'string'],
                'storeName' => ['required', 'string', 'max:20'],
                'storeLogo' => ['nullable'],
                'pageHeaderImage' => ['nullable'],
                'pageHeaderText' => ['nullable'],
                'currency' => ['required', 'string', Rule::in(array_values(Settings::CURRENCY))],
            ],
            default => [],
        };
    }

    protected function updateRules()
    {
        $tab = $this->input('tab');
        $domainSuffix = config('app.domain_suffix');

        return match ($tab) {
            'themeTab' => [
                'theme' => ['required', 'string'],
                'storeName' => ['required', 'string', 'max:20'],
                'storeLogo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
                'pageHeaderImage' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
                'pageHeaderText' => ['required', 'string'],
                'currency' => ['required', 'string', Rule::in(array_values(Settings::CURRENCY))],
                'metaDescription' => ['nullable', 'string', 'max:200']
            ],
            'contactTab' => [
                'contacts' => ['required', 'array'],
                'contacts.*.type' => ['required', 'string', Rule::in(array_keys(Settings::CONTACT_TYPES))],
                'contacts.*.value' => ['required', 'string', 'max:25'],
            ],
            'domainTab' => [
                'domains' => ['required', 'array'],
                'domains.*' => [
                    'required',
                    'string',
                    'min:3',
                    'max:15',
                    'distinct',
                    // Không trùng trong DB MySQL
                    function ($attribute, $value, $fail) {
                        $domainExists = Stores::whereJsonContains('domain', $value)->exists();
                        if ($domainExists) {
                            $fail(__('Domain already exists'));
                        }
                    },
                    // Kiểm tra định dạng hợp lệ
                    function ($attribute, $value, $fail) {
                        $pattern = '/^(?!-)[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/';
                        if (!preg_match($pattern, $value)) {
                            $fail(__("The domain ':value' is invalid.", ['value' => $value]));
                        }
                    },
                    // Không kết thúc bằng domainSuffix
                    function ($attribute, $value, $fail) use ($domainSuffix) {
                        if (str_ends_with($value, $domainSuffix)) {
                            $fail(__("The domain must not end with :suffix.", ['suffix' => $domainSuffix]));
                        }
                    }
                ]
            ],
            'notificationTab' => [
                'notification' => ['required', 'array'],
                'notification.enabled' => ['required'],
                'notification.groupId' => ['required_if:notification.enabled,true', 'string', 'max:50'],
                'notification.topicId' => ['required_if:notification.enabled,true', 'string', 'max:20'],
                'notification.message' => ['required_if:notification.enabled,true', 'string', 'max:2000'],
            ],
            default => [],
        };
    }
}
