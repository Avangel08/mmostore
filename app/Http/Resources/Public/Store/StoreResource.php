<?php

namespace App\Http\Resources\Public\Store;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StoreResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this['id'] ?? null,
            'name' => $this['name'] ?? null,
            'owner_name' => $this?->whenLoaded('user', fn() => $this['user']['name'] ?? null) ?? null,
            'domain' => empty($this['domain'][0]) ? null : $this['domain'][0],
            'logo' => empty($this['data_setting']['storeLogo']) ? null : ($request->getSchemeAndHttpHost() . '/storage/' . $this['data_setting']['storeLogo']),
            'meta_description' => $this['data_setting']['metaDescription'] ?? null,
            'header_image' => empty($this['data_setting']['pageHeaderImage']) ? null : ($request->getSchemeAndHttpHost() . '/storage/' . $this['data_setting']['pageHeaderImage']),
            'header_text' => $this['data_setting']['pageHeaderText'] ?? null,
            'store_categories' => $this?->whenLoaded(
                'storeCategories',
                fn() =>
                $this['storeCategories']->map(function ($category) {
                    return [
                        'id' => $category['id'] ?? null,
                        'name' => $category['name'] ?? null,
                    ];
                }),
            ) ?? null,
        ];
    }
}
