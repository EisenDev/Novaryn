<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    /**
     * Display a listing of testimonials.
     */
    public function index(): JsonResponse
    {
        $testimonials = Testimonial::orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $testimonials
        ]);
    }

    /**
     * Store a newly created testimonial.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'photo' => 'nullable|string',
            'rating' => 'integer|min:1|max:5',
            'review' => 'required|string',
            'featured' => 'boolean',
        ]);

        $testimonial = Testimonial::create($validated);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'CREATE_TESTIMONIAL',
            'model_type' => Testimonial::class,
            'model_id' => $testimonial->id,
            'new_values' => $testimonial->toArray(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Testimonial created successfully.',
            'data' => $testimonial
        ], 201);
    }

    /**
     * Display the specified testimonial.
     */
    public function show(Testimonial $testimonial): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $testimonial
        ]);
    }

    /**
     * Update the specified testimonial.
     */
    public function update(Request $request, Testimonial $testimonial): JsonResponse
    {
        $oldValues = $testimonial->toArray();

        $validated = $request->validate([
            'client_name' => 'string|max:255',
            'company' => 'string|max:255',
            'position' => 'string|max:255',
            'photo' => 'nullable|string',
            'rating' => 'integer|min:1|max:5',
            'review' => 'string',
            'featured' => 'boolean',
        ]);

        $testimonial->update($validated);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'UPDATE_TESTIMONIAL',
            'model_type' => Testimonial::class,
            'model_id' => $testimonial->id,
            'old_values' => $oldValues,
            'new_values' => $testimonial->toArray(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Testimonial updated successfully.',
            'data' => $testimonial
        ]);
    }

    /**
     * Remove the specified testimonial.
     */
    public function destroy(Request $request, Testimonial $testimonial): JsonResponse
    {
        $oldValues = $testimonial->toArray();
        $testimonial->delete();

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'DELETE_TESTIMONIAL',
            'model_type' => Testimonial::class,
            'model_id' => $testimonial->id,
            'old_values' => $oldValues,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Testimonial deleted successfully.'
        ]);
    }
}
