<?php

namespace App\Http\Resources\Admin\Post;

use App\Models\MySQL\Posts;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->title,
            'thumbnail' => $this->thumbnail,
            'short_description' => $this->short_description,
            'content' => $this->content,
            'status' => array_flip(Posts::STATUS)[$this->status],
            'visibility' => array_flip(Posts::VISIBILITY)[$this->visibility],
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString()
        ];
    }
}
