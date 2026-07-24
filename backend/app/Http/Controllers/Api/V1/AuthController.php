<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Authenticate admin user and return Sanctum API token.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        // Verify that the user is an admin role (sales, developer, admin, super_admin, marketing)
        if (!$user->hasRole(['super_admin', 'admin', 'sales', 'developer', 'marketing'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access. Client accounts are not permitted.'
            ], 403);
        }

        // Revoke existing tokens for a clean session
        $user->tokens()->delete();

        // Create token containing user role
        $token = $user->createToken('admin-api-token', [$user->role])->plainTextToken;

        // Log audit log event
        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'LOGIN',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Logged in successfully.',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role
            ]
        ]);
    }

    /**
     * Get details of the authenticated user.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'status' => 'success',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role
            ]
        ]);
    }

    /**
     * Revoke active token (logout).
     */
    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();

        // Revoke token
        $user->currentAccessToken()->delete();

        // Log audit log event
        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'LOGOUT',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully.'
        ]);
    }
}
