<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\PricingPackage;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PricingPackageController extends Controller
{
    /**
     * Display a listing of pricing packages.
     */
    public function index(): JsonResponse
    {
        $packages = PricingPackage::orderBy('sort_order', 'asc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $packages
        ]);
    }

    /**
     * Store a newly created package.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'setup_price' => 'required|string|max:100',
            'monthly_price' => 'required|string|max:100',
            'description' => 'nullable|string',
            'features' => 'required|array',
            'features.*' => 'string',
            'recommended' => 'boolean',
            'button_text' => 'nullable|string|max:100',
            'sort_order' => 'integer',
            'visible' => 'boolean',
        ]);

        $package = PricingPackage::create($validated);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'CREATE_PRICING',
            'model_type' => PricingPackage::class,
            'model_id' => $package->id,
            'new_values' => $package->toArray(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Pricing package created successfully.',
            'data' => $package
        ], 201);
    }

    /**
     * Display the specified package.
     */
    public function show(PricingPackage $pricing): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $pricing
        ]);
    }

    /**
     * Update the specified package.
     */
    public function update(Request $request, PricingPackage $pricing): JsonResponse
    {
        $oldValues = $pricing->toArray();

        $validated = $request->validate([
            'name' => 'string|max:255',
            'setup_price' => 'string|max:100',
            'monthly_price' => 'string|max:100',
            'description' => 'nullable|string',
            'features' => 'array',
            'features.*' => 'string',
            'recommended' => 'boolean',
            'button_text' => 'nullable|string|max:100',
            'sort_order' => 'integer',
            'visible' => 'boolean',
        ]);

        $pricing->update($validated);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'UPDATE_PRICING',
            'model_type' => PricingPackage::class,
            'model_id' => $pricing->id,
            'old_values' => $oldValues,
            'new_values' => $pricing->toArray(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Pricing package updated successfully.',
            'data' => $pricing
        ]);
    }

    /**
     * Remove the specified package.
     */
    public function destroy(Request $request, PricingPackage $pricing): JsonResponse
    {
        $oldValues = $pricing->toArray();
        $pricing->delete();

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'DELETE_PRICING',
            'model_type' => PricingPackage::class,
            'model_id' => $pricing->id,
            'old_values' => $oldValues,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Pricing package deleted successfully.'
        ]);
    }
}
