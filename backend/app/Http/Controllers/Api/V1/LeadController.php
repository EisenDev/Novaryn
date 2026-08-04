<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

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

        // Mark all unviewed leads as viewed when admin loads the leads list
        Lead::where('is_viewed', false)->update(['is_viewed' => true]);

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
            'status' => 'nullable|string|max:50',
        ]);

        $lead->update($validated);

        if (isset($validated['status']) && $validated['status'] === 'won') {
            $this->bootstrapProjectForLead($lead);
        }

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

        if ($validated['status'] === 'won') {
            $this->bootstrapProjectForLead($lead);
        }

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

    /**
     * Send meeting schedule invite link via Resend.
     */
    public function sendInvite(Request $request, Lead $lead): JsonResponse
    {
        $frontUrl = env('FRONTEND_URL', 'http://localhost:3002');
        $scheduleLink = $frontUrl . '/schedule-meeting?email=' . urlencode($lead->email);

        $subject = "Select your Consultation Schedule - Novaryn Tech";
        $html = '
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #047857; margin-top: 10px;">Book Your Consultation Call</h2>
            </div>
            <p>Dear <strong>\' . htmlspecialchars($lead->name) . \'</strong>,</p>
            <p>We received your inquiry regarding your custom platform project. To align on requirements, let\'s set up a consultation call or physical meetup in Digos City.</p>
            <p>Please click the button below to view our calendar availability and select your preferred slot:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="' . $scheduleLink . '" style="background-color: #047857; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Choose Date & Time</a>
            </div>
            <p style="color: #6b7280; font-size: 11px; text-align: center; margin-top: 30px;">
                Novaryn Tech Solutions · Digos City, Davao del Sur, Philippines
            </p>
        </div>';

        // Send email helper
        $this->sendResendEmail($lead->email, $subject, $html);

        // Update lead status to contacted
        $lead->update(['status' => 'contacted']);

        return response()->json([
            'status' => 'success',
            'message' => 'Consultation booking invitation sent successfully.',
            'link' => $scheduleLink
        ]);
    }

    /**
     * Send email via Resend API
     */
    protected function sendResendEmail(string $to, string $subject, string $htmlContent): bool
    {
        $apiKey = env('RESEND_API_KEY');
        if (empty($apiKey) || $apiKey === 're_your_api_key_here') {
            \Log::info("Resend API Key is empty or placeholder inside LeadController. Logging email content instead: To: $to, Subject: $subject");
            return false;
        }

        $from = env('RESEND_FROM_EMAIL', 'onboarding@resend.dev');

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->post('https://api.resend.com/emails', [
                'from' => 'Novaryn Tech <' . $from . '>',
                'to' => [$to],
                'subject' => $subject,
                'html' => $htmlContent,
            ]);

            if ($response->successful()) {
                return true;
            }

            \Log::error("Resend API failed: " . $response->body());
            return false;
        } catch (\Exception $e) {
            \Log::error("Exception when calling Resend API: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Bootstrap an active project build from a won lead.
     */
    protected function bootstrapProjectForLead(Lead $lead)
    {
        $exists = \App\Models\Project::where('client_name', $lead->name)->exists();
        if (!$exists) {
            $project = \App\Models\Project::create([
                'title' => $lead->name . ' Custom System',
                'slug' => \Illuminate\Support\Str::slug($lead->name . ' Custom System') . '-' . time(),
                'description' => $lead->message ?? 'Custom system software platform developed by Novaryn.',
                'industry' => $lead->industry ?? 'Technology',
                'client_name' => $lead->name,
                'stage' => 'Discovery',
                'progress' => 0,
                'status' => 'draft', // draft status makes it an active internal project (not showcase portfolio yet)
                'tech_stack' => [],
                'features' => []
            ]);

            // Query if there is a quotation matching this client's email
            $quotation = \App\Models\Quotation::where('client_email', trim($lead->email))->first();
            $invoiceAmount = 150000; // default standard pricing build cost
            $invoiceType = 'full_payment';

            if ($quotation) {
                $downpayment = $quotation->downpayment ?? 0;
                $buildTotal = $quotation->build_total ?? 150000;

                if ($downpayment > 0) {
                    $invoiceAmount = $downpayment;
                    $invoiceType = 'downpayment';
                } else {
                    $invoiceAmount = $buildTotal;
                    $invoiceType = 'full_payment';
                }
            }

            // Create initial invoice
            \App\Models\Invoice::create([
                'invoice_number' => 'INV-' . date('Ymd') . '-' . strtoupper(\Illuminate\Support\Str::random(4)),
                'client_name' => $lead->name,
                'client_email' => $lead->email,
                'amount' => $invoiceAmount,
                'type' => $invoiceType,
                'status' => 'unpaid',
                'due_date' => now()->addDays(7)->toDateString(),
                'project_id' => $project->id
            ]);
        }
    }
}
