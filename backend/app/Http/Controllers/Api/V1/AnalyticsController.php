<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\Project;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    /**
     * Get analytics and dashboard metrics.
     */
    public function metrics(Request $request): JsonResponse
    {
        $todayLeads = Lead::whereDate('created_at', now()->toDateString())->count();
        
        $thisMonthLeads = Lead::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        $totalProjects = Project::count();
        
        $pendingConsultations = Lead::whereIn('status', ['new', 'contacted', 'meeting_scheduled'])->count();
        
        $wonDeadsCount = Lead::where('status', 'won')->count();

        // Calculate estimated revenue from won leads budgets (e.g. summing budgets like "199,000" or similar)
        // For simplicity, we can fetch a manually logged revenue target or estimate it
        $revenue = Setting::getVal('manual_revenue', '₱845,000');

        // Recent leads
        $recentLeads = Lead::orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Industry distribution
        $industriesBreakdown = Lead::select('industry', DB::raw('count(*) as total'))
            ->groupBy('industry')
            ->orderBy('total', 'desc')
            ->get();

        // Status pipeline breakdown
        $statusBreakdown = Lead::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'metrics' => [
                    'today_leads' => $todayLeads,
                    'this_month_leads' => $thisMonthLeads,
                    'total_projects' => $totalProjects,
                    'pending_consultations' => $pendingConsultations,
                    'won_deals' => $wonDeadsCount,
                    'revenue' => $revenue
                ],
                'recent_leads' => $recentLeads,
                'industries_breakdown' => $industriesBreakdown,
                'status_breakdown' => $statusBreakdown
            ]
        ]);
    }
}
