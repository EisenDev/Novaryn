<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    /**
     * Display a listing of leads (paginated, with sorting and filtering).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Lead::query();

        // Filters
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        
        if ($request->has('industry') && $request->industry !== 'all') {
            $query->where('industry', $request->industry);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Sorting
        $orderBy = $request->get('order_by', 'created_at');
        $orderDir = $request->get('order_dir', 'desc');
        $query->orderBy($orderBy, $orderDir);

        $leads = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $leads
        ]);
    }

    /**
     * Store a newly created lead in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'industry' => 'nullable|string|max:100',
            'budget' => 'nullable|string|max:100',
            'timeline' => 'nullable|string|max:100',
            'message' => 'nullable|string|max:5000',
            'status' => 'nullable|string|max:50',
            'source' => 'nullable|string|max:50',
        ]);

        $lead = Lead::create($validated);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'CREATE_LEAD',
            'model_type' => Lead::class,
            'model_id' => $lead->id,
            'new_values' => $lead->toArray(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Lead created successfully.',
            'data' => $lead
        ], 201);
    }

    /**
     * Display the specified lead.
     */
    public function show(Lead $lead): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $lead
        ]);
    }

    /**
     * Update the specified lead in storage.
     */
    public function update(Request $request, Lead $lead): JsonResponse
    {
        $oldValues = $lead->toArray();
        
        $validated = $request->validate([
            'name' => 'string|max:255',
            'company' => 'nullable|string|max:255',
            'email' => 'email|max:255',
            'phone' => 'nullable|string|max:50',
            'industry' => 'nullable|string|max:100',
            'budget' => 'nullable|string|max:100',
            'timeline' => 'nullable|string|max:100',
            'message' => 'nullable|string|max:5000',
            'notes' => 'nullable|string',
            'meeting_date' => 'nullable|date',
        ]);

        $lead->update($validated);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'UPDATE_LEAD',
            'model_type' => Lead::class,
            'model_id' => $lead->id,
            'old_values' => $oldValues,
            'new_values' => $lead->toArray(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Lead updated successfully.',
            'data' => $lead
        ]);
    }

    /**
     * Update the status of a lead.
     */
    public function updateStatus(Request $request, Lead $lead): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:new,contacted,meeting_scheduled,proposal_sent,negotiation,won,lost,archived',
        ]);

        $oldValues = $lead->toArray();
        $lead->update(['status' => $validated['status']]);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'LEAD_STATUS_CHANGE',
            'model_type' => Lead::class,
            'model_id' => $lead->id,
            'old_values' => $oldValues,
            'new_values' => $lead->toArray(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Lead status updated to ' . $validated['status'],
            'data' => $lead
        ]);
    }

    /**
     * Assign a user to the lead.
     */
    public function assignUser(Request $request, Lead $lead): JsonResponse
    {
        $validated = $request->validate([
            'assigned_to' => 'required|uuid|exists:users,id',
        ]);

        $oldValues = $lead->toArray();
        $lead->update(['assigned_to' => $validated['assigned_to']]);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'LEAD_ASSIGNMENT',
            'model_type' => Lead::class,
            'model_id' => $lead->id,
            'old_values' => $oldValues,
            'new_values' => $lead->toArray(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Lead assigned successfully.',
            'data' => $lead
        ]);
    }

    /**
     * Remove the lead from storage (soft delete).
     */
    public function destroy(Request $request, Lead $lead): JsonResponse
    {
        $oldValues = $lead->toArray();
        $lead->delete();

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'DELETE_LEAD',
            'model_type' => Lead::class,
            'model_id' => $lead->id,
            'old_values' => $oldValues,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Lead deleted (archived) successfully.'
        ]);
    }
}
