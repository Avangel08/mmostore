<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use App\Services\Posts\PostService;
use Illuminate\Support\Facades\View;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    protected $postService;
    public function __construct(PostService $postService)
    {
        $this->postService = $postService;
    }
    public function index()
    {
        return Inertia::render('index');
    }

    public function post(string $slug)
    {
        $post = $this->postService->findBySlug($slug, ['*']);
        if (!$post) {
            abort(404);
        }
        return Inertia::render('Post/PostDetail', [
            'post' => $post,
        ]);
    }
}


