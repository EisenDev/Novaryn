<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\PublicController;
use App\Http\Controllers\Api\V1\LeadController;
use App\Http\Controllers\Api\V1\PricingPackageController;
use App\Http\Controllers\Api\V1\ProjectController;
use App\Http\Controllers\Api\V1\TestimonialController;
use App\Http\Controllers\Api\V1\BlogPostController;
use App\Http\Controllers\Api\V1\SettingController;
use App\Http\Controllers\Api\V1\AnalyticsController;
use App\Http\Controllers\Api\V1\PricingEngineController;
use App\Http\Controllers\Api\V1\InvoiceController;

/*
|--------------------------------------------------------------------------
| API Routes - V1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // 1. Public Endpoints (Next.js Marketing Site)
    Route::get('/pricing', [PublicController::class, 'pricing']);
    Route::get('/projects', [PublicController::class, 'projects']);
    Route::get('/projects/{slug}', [PublicController::class, 'projectDetails']);
    Route::get('/testimonials', [PublicController::class, 'testimonials']);
    Route::get('/faqs', [PublicController::class, 'faqs']);
    Route::get('/settings', [PublicController::class, 'settings']);
    
    Route::post('/leads', [PublicController::class, 'submitLead']);
    Route::post('/contact', [PublicController::class, 'submitContact']);
    Route::post('/newsletter', [PublicController::class, 'subscribeNewsletter']);
    
    // Public Scheduler routes
    Route::get('/public/leads/verify', [PublicController::class, 'verifyLead']);
    Route::post('/public/leads/schedule', [PublicController::class, 'scheduleLead']);
    Route::get('/public/pricing/plans', [PricingEngineController::class, 'plans']);

    // 2. Admin Authentication
    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::put('/profile', [AuthController::class, 'updateProfile']);
            Route::post('/profile', [AuthController::class, 'updateProfile']); // FormData _method=PUT fallback
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/users', [AuthController::class, 'usersList']);
            Route::post('/users', [AuthController::class, 'createUserAccount']);
            Route::put('/users/{id}', [AuthController::class, 'updateUserRole']);
            Route::delete('/users/{id}', [AuthController::class, 'deleteUser']);
        });
    });

    // 3. Protected Administration Dashboard API
    Route::middleware('auth:sanctum')->group(function () {
        // Pricing Engine
        Route::prefix('pricing')->group(function () {
            Route::get('plans', [PricingEngineController::class, 'plans']);
            Route::get('plans/{slug}', [PricingEngineController::class, 'plan']);
            Route::post('calculate', [PricingEngineController::class, 'calculate']);
            Route::post('quotations', [PricingEngineController::class, 'saveQuotation']);
            Route::get('quotations', [PricingEngineController::class, 'quotations']);
            Route::patch('modules/{moduleId}', [PricingEngineController::class, 'updateModule']);
        });

        // Leads management
        Route::apiResource('leads', LeadController::class);
        Route::patch('leads/{lead}/status', [LeadController::class, 'updateStatus']);
        Route::patch('leads/{lead}/assign', [LeadController::class, 'assignUser']);
        Route::post('leads/{lead}/notes', [LeadController::class, 'addNote']);
        Route::post('leads/{lead}/send-invite', [LeadController::class, 'sendInvite']);

        // Pricing packages
        Route::apiResource('pricing', PricingPackageController::class);

        // Projects & Case Studies
        Route::apiResource('projects', ProjectController::class);

        // Billing & Invoices
        Route::get('invoices/stats', [InvoiceController::class, 'stats']);
        Route::apiResource('invoices', InvoiceController::class);

        // Testimonials
        Route::apiResource('testimonials', TestimonialController::class);

        // Blog
        Route::apiResource('blog', BlogPostController::class);

        // Settings
        Route::get('/system/settings', [SettingController::class, 'index']);
        Route::post('/system/settings', [SettingController::class, 'update']);

        // Audit Logs
        Route::get('/system/audit-logs', [SettingController::class, 'auditLogs']);

        // Dashboard Analytics
        Route::get('/dashboard/analytics', [AnalyticsController::class, 'metrics']);

        // Sidebar Badge Counts (new leads, pending consultations, new quotations)
        Route::get('/dashboard/badges', [AnalyticsController::class, 'badges']);

        // Quotation Delete Workflow (safe pending deletion)
        Route::patch('pricing/quotations/{id}/request-delete', [PricingEngineController::class, 'requestDeletion']);
        Route::patch('pricing/quotations/{id}/approve-delete', [PricingEngineController::class, 'approveDeletion']);
        Route::patch('pricing/quotations/{id}/reject-delete', [PricingEngineController::class, 'rejectDeletion']);
        Route::delete('pricing/quotations/{id}', [PricingEngineController::class, 'destroyQuotation']);
    });
});
