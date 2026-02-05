<?php

namespace App\Http\Controllers\Admin\Posts;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\Post\PostResource;
use App\Models\MySQL\Posts;
use App\Services\Posts\PostService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PostController extends Controller
{
    protected $postService;

    public function __construct(PostService $postService)
    {
        $this->postService = $postService;
    }

    public function index()
    {
        $posts = $this->postService->getPosts();
        $statusList = array_flip(Posts::LIST_STATUS);

        return Inertia::render('Posts/Index', [
            'posts' => fn() => PostResource::collection($posts),
            'statusList' => $statusList
        ]);
    }

    public function create()
    {

        $optionStatus = [];
        foreach (Posts::LIST_STATUS as $key => $value) {
            $optionStatus[] = [
                'label' => $key,
                'value' => $value
            ];
        }

        $optionVisibility = [];
        foreach (Posts::LIST_VISIBILITY as $key => $value) {
            $optionVisibility[] = [
                'label' => $key,
                'value' => $value
            ];
        }

        return Inertia::render('Posts/PostForm', [
            'optionStatus' => fn() => $optionStatus,
            'optionVisibility' => fn() => $optionVisibility
        ]);
    }

    public function store(Request $request)
    {
        try {
            $data = $request->all();
            $userId = auth('admin')->user()->id;
            $data['user_id'] = $userId;
            $this->postService->createPost($data);
            return redirect()->route('admin.posts.index')->with('success', 'Thêm bài viết thành công!');
        } catch (\Exception $e) {
            dd($e);
            return back()->with('error', $e->getMessage());
        }
    }

    public function edit($id)
    {
        $post = $this->postService->findById($id);

        $optionStatus = [];
        foreach (Posts::LIST_STATUS as $key => $value) {
            $optionStatus[] = [
                'label' => $key,
                'value' => $value
            ];
        }

        $optionVisibility = [];
        foreach (Posts::LIST_VISIBILITY as $key => $value) {
            $optionVisibility[] = [
                'label' => $key,
                'value' => $value
            ];
        }

        return Inertia::render('Posts/PostForm', [
            'optionStatus' => fn() => $optionStatus,
            'optionVisibility' => fn() => $optionVisibility,
            'post' => fn() => new PostResource($post)
        ]);
    }

    public function update(Request $request, $id)
    {
        $post = DB::table('posts')->find($id);
        $path = $post->image;

        if ($request->hasFile('image')) {
            if ($post->image) {
                Storage::disk('public')->delete($post->image);
            }
            $file = $request->file('image');
            $filename = time() . '-' . $file->getClientOriginalName();
            $path = $file->storeAs('images', $filename, 'public');
        }

        DB::table('posts')->where('id', $id)->update([
            'title' => $request->get('title'),
            'content' => $request->get('content'),
            'image' => $path,
            'status' => $request->get('status') ?? 'draft',
            'updated_at' => now(),
        ]);

        return redirect()->route('admin.posts.index')->with('success', 'Cập nhật thành công!');
    }

    public function show($id)
    {
        $post = DB::table('posts')->find($id);

        if (! $post) {
            abort(404, 'Bài viết không tồn tại');
        }

        return Inertia::render('Posts/Detail', [
            'post' => $post,
        ]);
    }

    public function destroy($id)
    {
        $post = DB::table('posts')->find($id);
        if ($post->image) {
            Storage::disk('public')->delete($post->image);
        }
        DB::table('posts')->where('id', $id)->delete();

        return redirect()->route('admin.posts.index')->with('success', 'Xóa bài viết thành công!');
    }
}
