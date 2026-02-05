<?php

namespace App\Http\Resources\Seller\Product;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "name" => $this->name,
            "image_url" => $request->getSchemeAndHttpHost() . '/storage/' . $this->image,
            "category_name" => $this->whenLoaded('category', fn() => $this->category->name),
            "product_type_name" => $this->whenLoaded('productType', fn() => $this->productType->name),
            "status" => $this->status,
            "short_description" => $this->short_description,
            "detail_description" => $this->detail_description,
            "updated_at" => $this->updated_at,
            "created_at" => $this->created_at,
        ];
    }
}
