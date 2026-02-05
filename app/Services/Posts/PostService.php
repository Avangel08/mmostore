<?php

namespace App\Services\Posts;

use App\Models\MySQL\Posts;
use Illuminate\Support\Str;

/**
 * Class PostService
 * @package App\Services
 */
class PostService
{
    public function getPosts()
    {
        return Posts::where('status', Posts::STATUS['PUBLISHED'])
            ->latest()
            ->paginate(10);
    }

    public function generatePostSlug($title)
    {
        $slug = Str::slug($title);
        $count = Posts::where('slug', 'LIKE', "%{$slug}%")->count();

        return $count ? "{$slug}-" . ($count + 1) : $slug;
    }

    public function createPost(array $data)
    {
        $postData = [
            'title' => (string) $data['title'],
            'content' => (string) $data['content'],
            'user_id' => (int) $data['user_id'],
            'slug' => (string) $this->generatePostSlug($data['title']),
            'category_id' => null, // (int) $data['category_id']
            'published_at' => (string) $data['published_at'],
            'status' =>  Posts::STATUS[$data['status']],
            'visibility' => Posts::VISIBILITY[$data['visibility']],
            'short_description' => (string) $data['shortDescription']
        ];

        $post = Posts::create($postData);

        if (!empty($data['thumbnail'])) {
            $host = request()->getHost();
            $extension = $data['thumbnail']->getClientOriginalExtension();
            $fileName = "post_" . $post->id . '_' . now()->format('Ymd_His') . '_' . uniqid() . '.' . $extension;
            $imagePath = $data['thumbnail']->storeAs("{$host}/posts", $fileName, 'public');
            $post->update(['thumbnail' => $imagePath]);
        }
        return $post;
    }

    public function findById($id, $select = ['*'], $relation = [])
    {
        return Posts::select($select)
            ->with($relation)
            ->where('id', $id)
            ->first();
    }

    public function findBySlug($slug, $select = ['*'], $relation = [])
    {
        return Posts::select($select)
            ->with($relation)
            ->where('slug', $slug)
            ->first();
    }
}
