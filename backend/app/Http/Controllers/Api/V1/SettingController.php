<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Display listing of all website settings.
     */
    public function index(): JsonResponse
    {
        $settings = Setting::all()->pluck('value', 'key');
        return response()->json([
            'status' => 'success',
            'data' => $settings
        ]);
    }

    /**
     * Update/Save system settings.
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*' => 'nullable|string',
        ]);

        $oldValues = Setting::all()->pluck('value', 'key')->toArray();

        foreach ($validated['settings'] as $key => $value) {
            Setting::setVal($key, $value);
        }

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'SETTING_CHANGE',
            'old_values' => $oldValues,
            'new_values' => Setting::all()->pluck('value', 'key')->toArray(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Settings updated successfully.',
            'data' => Setting::all()->pluck('value', 'key')
        ]);
    }

    /**
     * Retrieve audit logs.
     */
    public function auditLogs(Request $request): JsonResponse
    {
        $logs = AuditLog::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 25));

        return response()->json([
            'status' => 'success',
            'data' => $logs
        ]);
    }
}
