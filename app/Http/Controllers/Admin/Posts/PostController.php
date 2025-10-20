<?php

namespace App\Http\Controllers\Admin\Posts;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index()
    {
        $posts = DB::table('posts')->orderByDesc('id')->get();

        return Inertia::render('Posts/Index', [
            'posts' => $posts,
        ]);
    }

    public function create()
    {
        return Inertia::render('Posts/create');
    }

    public function store(Request $request)
    {
        $path = null;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time().'-'.$file->getClientOriginalName();
            $path = $file->storeAs('images', $filename, 'public');
        }

        DB::table('posts')->insert([
            'title' => $request->get('title'),
            'content' => $request->get('content'),
            'image' => $path,
            'status' => $request->get('status') ?? 'draft',
            'created_at' => now(),
        ]);

        return redirect()->route('admin.posts.index')->with('success', 'Thêm bài viết thành công!');
    }

    public function edit($id)
    {
        $post = DB::table('posts')->find($id);

        return Inertia::render('Posts/edit', [
            'post' => $post,
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
            $filename = time().'-'.$file->getClientOriginalName();
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

        return Inertia::render('Posts/detailPost', [
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