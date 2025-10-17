<?php

namespace App\Http\Resources\Seller\Product;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubProductResource extends JsonResource
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
            "status" => $this->status,
            'price' => $this->price,
            'quantity' => $this->quantity,
            'product_name' => $this->whenLoaded('product', fn() => $this->product->name),
            "updated_at" => $this->updated_at,
            "created_at" => $this->created_at,
        ];
    }
}
