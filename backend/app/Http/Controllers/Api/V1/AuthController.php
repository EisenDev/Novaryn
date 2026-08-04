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
                'role' => $user->role,
                'profile_picture' => $user->profile_picture
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
                'role' => $user->role,
                'profile_picture' => $user->profile_picture
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

    /**
     * Update details of the authenticated user.
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'password' => 'nullable|string|min:8|confirmed',
            'avatar'   => 'nullable|image|mimes:jpg,jpeg,png,gif,webp|max:4096',
        ]);

        $user->name = $validated['name'];

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($user->profile_picture) {
                $oldPath = str_replace('/storage/', '', parse_url($user->profile_picture, PHP_URL_PATH));
                if (\Illuminate\Support\Facades\Storage::disk('public')->exists($oldPath)) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
                }
            }
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->profile_picture = config('app.url') . '/storage/' . $path;
        }

        $user->save();

        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'UPDATE_PROFILE',
            'new_values' => [
                'name' => $user->name,
                'profile_picture' => $user->profile_picture
            ],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Profile settings updated successfully.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'profile_picture' => $user->profile_picture
            ]
        ]);
    }

    /**
     * Display listing of team members (super_admin only).
     */
    public function usersList(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'super_admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access. Only Co-Founder & CEO accounts can review employee registries.'
            ], 403);
        }

        $users = User::withTrashed()->orderBy('name', 'asc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $users
        ]);
    }

    /**
     * Create employee login account.
     */
    public function createUserAccount(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'super_admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access. Only Co-Founder & CEO accounts can add team members.'
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:super_admin,admin,developer,sales,marketing'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role']
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Team member registered successfully.',
            'data' => $user
        ], 201);
    }

    /**
     * Update employee corporate role and status.
     */
    public function updateUserRole(Request $request, string $id): JsonResponse
    {
        if ($request->user()->role !== 'super_admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access. Only Co-Founder & CEO accounts can update role permissions.'
            ], 403);
        }

        $user = User::withTrashed()->findOrFail($id);

        $validated = $request->validate([
            'role' => 'required|string|in:super_admin,admin,developer,sales,marketing',
            'status' => 'required|string|in:active,inactive'
        ]);

        // Prevent demoting the last super admin
        if ($user->role === 'super_admin' && $validated['role'] !== 'super_admin') {
            $superAdminCount = User::where('role', 'super_admin')->count();
            if ($superAdminCount <= 1) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Cannot demote the primary CEO account. Assign another Super Admin first.'
                ], 422);
            }
        }

        $user->role = $validated['role'];

        if ($validated['status'] === 'inactive') {
            $user->delete();
        } else {
            if ($user->trashed()) {
                $user->restore();
            }
        }

        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Team member credentials updated successfully.',
            'data' => $user
        ]);
    }
}
