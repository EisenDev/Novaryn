<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\PlanModule;
use App\Models\Quotation;
use App\Models\QuotationModule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PricingEngineController extends Controller
{
    public function plans(Request $request)
    {
        $plans = Plan::with(['modules' => function ($query) {
            $query->orderBy('sort_order');
        }])->where('is_active', true)->orderBy('sort_order')->get();

        return response()->json([
            'data' => $plans
        ]);
    }

    public function plan(Request $request, string $slug)
    {
        $plan = Plan::with(['modules' => function ($query) {
            $query->orderBy('sort_order');
        }])->where('slug', $slug)->firstOrFail();

        return response()->json([
            'data' => $plan
        ]);
    }

    public function calculate(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'enabled_module_ids' => 'required|array',
            'enabled_module_ids.*' => 'exists:plan_modules,id'
        ]);

        $plan = Plan::findOrFail($request->plan_id);
        $enabledModuleIds = $request->enabled_module_ids;

        // Fetch required modules that might be missing from request
        $requiredModules = PlanModule::where('plan_id', $plan->id)
            ->where('is_required', true)
            ->pluck('id')
            ->toArray();

        $allEnabledIds = array_unique(array_merge($enabledModuleIds, $requiredModules));

        $modules = PlanModule::whereIn('id', $allEnabledIds)->get();

        $buildModulesSum = $modules->where('category', 'build')->sum('build_price');
        $monthlyModulesSum = $modules->sum('monthly_price'); // Support + Build monthly

        $buildTotal = max($plan->minimum_build_price, $buildModulesSum);
        $monthlyTotal = max($plan->minimum_monthly_price, $monthlyModulesSum);

        return response()->json([
            'data' => [
                'build_total' => $buildTotal,
                'monthly_total' => $monthlyTotal,
                'minimum_build' => $plan->minimum_build_price,
                'minimum_monthly' => $plan->minimum_monthly_price,
            ]
        ]);
    }

    public function saveQuotation(Request $request)
    {
        $request->validate([
            'client_name' => 'required|string',
            'client_email' => 'nullable|email',
            'plan_id' => 'required|exists:plans,id',
            'notes' => 'nullable|string',
            'enabled_module_ids' => 'required|array',
            'enabled_module_ids.*' => 'exists:plan_modules,id'
        ]);

        $plan = Plan::findOrFail($request->plan_id);
        $enabledModuleIds = $request->enabled_module_ids;
        
        $requiredModules = PlanModule::where('plan_id', $plan->id)
            ->where('is_required', true)
            ->pluck('id')
            ->toArray();

        $allEnabledIds = array_unique(array_merge($enabledModuleIds, $requiredModules));
        $modules = PlanModule::whereIn('id', $allEnabledIds)->get();

        $buildModulesSum = $modules->where('category', 'build')->sum('build_price');
        $monthlyModulesSum = $modules->sum('monthly_price');

        $buildTotal = max($plan->minimum_build_price, $buildModulesSum);
        $monthlyTotal = max($plan->minimum_monthly_price, $monthlyModulesSum);

        DB::beginTransaction();

        try {
            $quotation = Quotation::create([
                'client_name' => $request->client_name,
                'client_email' => $request->client_email,
                'plan_id' => $plan->id,
                'build_total' => $buildTotal,
                'monthly_total' => $monthlyTotal,
                'notes' => $request->notes,
                'status' => 'draft',
            ]);

            foreach ($modules as $module) {
                $quotation->quotationModules()->create([
                    'module_id' => $module->id,
                    'enabled' => true,
                    'build_price_snapshot' => $module->build_price,
                    'monthly_price_snapshot' => $module->monthly_price,
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Quotation saved successfully',
                'data' => $quotation->load('quotationModules.module')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to save quotation', 'message' => $e->getMessage()], 500);
        }
    }

    public function quotations(Request $request)
    {
        $quotations = Quotation::with('plan')->latest()->get();

        return response()->json([
            'data' => $quotations
        ]);
    }

    public function updateModule(Request $request, string $moduleId)
    {
        $request->validate([
            'build_price' => 'sometimes|integer|min:0',
            'monthly_price' => 'sometimes|integer|min:0',
            'enabled_by_default' => 'sometimes|boolean'
        ]);

        $module = PlanModule::findOrFail($moduleId);
        $module->update($request->only(['build_price', 'monthly_price', 'enabled_by_default']));

        return response()->json([
            'message' => 'Module updated successfully',
            'data' => $module
        ]);
    }
}
