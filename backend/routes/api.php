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

    // 2. Admin Authentication
    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);
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

        // Pricing packages
        Route::apiResource('pricing', PricingPackageController::class);

        // Projects & Case Studies
        Route::apiResource('projects', ProjectController::class);

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
    });
});
