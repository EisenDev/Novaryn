<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Project;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    /**
     * Display a listing of invoices.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Invoice::query();

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by type
        if ($request->has('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        // Search query
        if ($request->has('search') && !empty($request->search)) {
            $search = '%' . $request->search . '%';
            $query->where(function($q) use ($search) {
                $q->where('client_name', 'like', $search)
                  ->orWhere('invoice_number', 'like', $search)
                  ->orWhere('client_email', 'like', $search);
            });
        }

        $invoices = $query->orderBy('created_at', 'desc')->paginate($request->query('per_page', 25));

        return response()->json([
            'status' => 'success',
            'data' => $invoices
        ]);
    }

    /**
     * Store a newly created invoice in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'client_email' => 'required|email|max:255',
            'amount' => 'required|integer|min:1',
            'type' => 'required|string|in:downpayment,monthly_sla,full_payment,other',
            'status' => 'required|string|in:unpaid,paid,overdue',
            'due_date' => 'required|date',
            'project_id' => 'nullable|uuid|exists:projects,id'
        ]);

        // Generate unique invoice number: INV-YYYYMMDD-XXXX
        $validated['invoice_number'] = 'INV-' . date('Ymd') . '-' . strtoupper(Str::random(4));
        if ($validated['status'] === 'paid') {
            $validated['paid_at'] = now();
        }

        $invoice = Invoice::create($validated);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'CREATE_INVOICE',
            'model_type' => Invoice::class,
            'model_id' => $invoice->id,
            'new_values' => $invoice->toArray(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Invoice generated successfully.',
            'data' => $invoice
        ], 201);
    }

    /**
     * Display the specified invoice.
     */
    public function show(Invoice $invoice): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $invoice
        ]);
    }

    /**
     * Update the specified invoice in storage.
     */
    public function update(Request $request, Invoice $invoice): JsonResponse
    {
        $oldValues = $invoice->toArray();

        $validated = $request->validate([
            'client_name' => 'string|max:255',
            'client_email' => 'email|max:255',
            'amount' => 'integer|min:1',
            'type' => 'string|in:downpayment,monthly_sla,full_payment,other',
            'status' => 'string|in:unpaid,paid,overdue',
            'due_date' => 'date',
            'project_id' => 'nullable|uuid|exists:projects,id'
        ]);

        if (isset($validated['status'])) {
            if ($validated['status'] === 'paid' && $invoice->status !== 'paid') {
                $validated['paid_at'] = now();
            } elseif ($validated['status'] !== 'paid') {
                $validated['paid_at'] = null;
            }
        }

        $invoice->update($validated);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'UPDATE_INVOICE',
            'model_type' => Invoice::class,
            'model_id' => $invoice->id,
            'old_values' => $oldValues,
            'new_values' => $invoice->toArray(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Invoice updated successfully.',
            'data' => $invoice
        ]);
    }

    /**
     * Remove the specified invoice from storage.
     */
    public function destroy(Request $request, Invoice $invoice): JsonResponse
    {
        $oldValues = $invoice->toArray();
        $invoice->delete();

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'DELETE_INVOICE',
            'model_type' => Invoice::class,
            'model_id' => $invoice->id,
            'old_values' => $oldValues,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Invoice removed successfully.'
        ]);
    }

    /**
     * Get aggregate statistics for financial overview.
     */
    public function stats(): JsonResponse
    {
        // 1. Calculate MRR & hosting costs from active projects
        $projects = Project::all();
        $totalMRR = 0;
        $totalServerCost = 0;
        $totalDbOtherCost = 0;
        $projectEarningsList = [];

        foreach ($projects as $p) {
            $cfg = $p->module_config ?? [];
            $mrr = $cfg['monthly_revenue'] ?? 0;
            $server = $cfg['server_cost'] ?? 0;
            $db = ($cfg['database_cost'] ?? 0) + ($cfg['other_cost'] ?? 0);

            $totalMRR += $mrr;
            $totalServerCost += $server;
            $totalDbOtherCost += $db;

            if ($mrr > 0) {
                $projectEarningsList[] = [
                    'id' => $p->id,
                    'title' => $p->title,
                    'client_name' => $p->client_name,
                    'mrr' => $mrr,
                    'expenses' => $server + $db,
                    'profit' => $mrr - ($server + $db)
                ];
            }
        }

        // 2. Sum up total payments received from invoices
        $totalOneTimeBuildPaid = Invoice::where('status', 'paid')
            ->whereIn('type', ['downpayment', 'full_payment'])
            ->sum('amount');

        $totalSlaPaid = Invoice::where('status', 'paid')
            ->where('type', 'monthly_sla')
            ->sum('amount');

        $totalUnpaidInvoices = Invoice::where('status', 'unpaid')->sum('amount');
        $totalOverdueInvoices = Invoice::where('status', 'overdue')->sum('amount');

        // Recent ledger entries
        $recentLedger = Invoice::orderBy('created_at', 'desc')->take(5)->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'mrr' => (int) $totalMRR,
                'arr' => (int) ($totalMRR * 12),
                'total_one_time_paid' => (int) $totalOneTimeBuildPaid,
                'total_sla_paid' => (int) $totalSlaPaid,
                'total_hosting_expenses' => (int) ($totalServerCost + $totalDbOtherCost),
                'server_cost' => (int) $totalServerCost,
                'db_other_cost' => (int) $totalDbOtherCost,
                'unpaid_volume' => (int) $totalUnpaidInvoices,
                'overdue_volume' => (int) $totalOverdueInvoices,
                'project_contributions' => $projectEarningsList,
                'recent_ledger' => $recentLedger
            ]
        ]);
    }
}
