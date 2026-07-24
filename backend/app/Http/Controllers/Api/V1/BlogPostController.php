<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogPostController extends Controller
{
    /**
     * Display a listing of blog posts.
     */
    public function index(Request $request): JsonResponse
    {
        $query = BlogPost::query();

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        $posts = $query->orderBy('created_at', 'desc')->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $posts
        ]);
    }

    /**
     * Store a newly created post in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'summary' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'status' => 'nullable|string|in:draft,published,scheduled',
            'published_at' => 'nullable|date',
            'category' => 'required|string|max:100',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string',
        ]);

        $validated['slug'] = Str::slug($validated['title']);
        
        // Handle slug collision
        $count = BlogPost::where('slug', 'like', $validated['slug'] . '%')->count();
        if ($count > 0) {
            $validated['slug'] .= '-' . ($count + 1);
        }

        if ($validated['status'] === 'published' && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $post = BlogPost::create($validated);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'CREATE_BLOG_POST',
            'model_type' => BlogPost::class,
            'model_id' => $post->id,
            'new_values' => $post->toArray(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Blog post created successfully.',
            'data' => $post
        ], 201);
    }

    /**
     * Display the specified post.
     */
    public function show(BlogPost $blog): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $blog
        ]);
    }

    /**
     * Update the specified post in storage.
     */
    public function update(Request $request, BlogPost $blog): JsonResponse
    {
        $oldValues = $blog->toArray();

        $validated = $request->validate([
            'title' => 'string|max:255',
            'content' => 'string',
            'summary' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'status' => 'string|in:draft,published,scheduled',
            'published_at' => 'nullable|date',
            'category' => 'string|max:100',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string',
        ]);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        if (isset($validated['status']) && $validated['status'] === 'published' && empty($blog->published_at)) {
            $validated['published_at'] = now();
        }

        $blog->update($validated);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'UPDATE_BLOG_POST',
            'model_type' => BlogPost::class,
            'model_id' => $blog->id,
            'old_values' => $oldValues,
            'new_values' => $blog->toArray(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Blog post updated successfully.',
            'data' => $blog
        ]);
    }

    /**
     * Remove the specified post (soft delete).
     */
    public function destroy(Request $request, BlogPost $blog): JsonResponse
    {
        $oldValues = $blog->toArray();
        $blog->delete();

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'DELETE_BLOG_POST',
            'model_type' => BlogPost::class,
            'model_id' => $blog->id,
            'old_values' => $oldValues,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Blog post soft deleted successfully.'
        ]);
    }
}
