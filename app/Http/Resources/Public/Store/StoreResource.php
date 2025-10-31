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
            'name' => empty($this['name']) ? null : strip_tags($this['name']),
            'domain' => empty($this['domain'][0]) ? null : $this['domain'][0],
            
            'logo' => empty($this['data_setting']['storeLogo']) ? null : ($request->getSchemeAndHttpHost() . '/storage/' . $this['data_setting']['storeLogo']),
            'meta_description' => empty($this['data_setting']['metaDescription']) ? null : strip_tags($this['data_setting']['metaDescription']),
            'header_image' => empty($this['data_setting']['pageHeaderImage']) ? null : ($request->getSchemeAndHttpHost() . '/storage/' . $this['data_setting']['pageHeaderImage']),
            'header_text' => empty($this['data_setting']['pageHeaderText']) ? null : strip_tags($this['data_setting']['pageHeaderText']),

            'store_categories' => $this?->whenLoaded(
                'storeCategories',
                fn() =>
                $this['storeCategories']?->map(function ($category) {
                    return [
                        'id' => $category['id'] ?? null,
                        'name' => empty($category['name']) ? null : strip_tags($category['name']),
                    ];
                }) ?? null,
            ) ?? null,
        ];
    }
}
