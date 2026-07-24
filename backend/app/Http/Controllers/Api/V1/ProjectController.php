<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\CaseStudy;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class ProjectController extends Controller
{
    /**
     * Display a listing of projects.
     */
    public function index(): JsonResponse
    {
        $projects = Project::with('caseStudy')->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $projects
        ]);
    }

    /**
     * Store a newly created project and its case study.
     */
    public function store(Request $request): JsonResponse
    {
        $validatedProject = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'industry' => 'required|string|max:100',
            'cover_image' => 'nullable|string',
            'gallery' => 'nullable|array',
            'gallery.*' => 'string',
            'tech_stack' => 'required|array',
            'tech_stack.*' => 'string',
            'features' => 'required|array',
            'features.*' => 'string',
            'status' => 'nullable|string|in:draft,published,featured',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string',
        ]);

        $validatedCaseStudy = $request->validate([
            'case_study' => 'nullable|array',
            'case_study.statistics' => 'nullable|array',
            'case_study.results' => 'nullable|string',
            'case_study.challenges' => 'nullable|string',
            'case_study.solutions' => 'nullable|string',
            'case_study.client_feedback' => 'nullable|string',
            'case_study.client_author' => 'nullable|string',
            'case_study.client_role' => 'nullable|string',
        ]);

        // Generate slug automatically
        $validatedProject['slug'] = Str::slug($validatedProject['title']);
        
        // Handle slug collision
        $count = Project::where('slug', 'like', $validatedProject['slug'] . '%')->count();
        if ($count > 0) {
            $validatedProject['slug'] .= '-' . ($count + 1);
        }

        $project = DB::transaction(function () use ($validatedProject, $validatedCaseStudy) {
            $project = Project::create($validatedProject);

            // Create case study if passed
            if (!empty($validatedCaseStudy['case_study'])) {
                $caseStudyData = $validatedCaseStudy['case_study'];
                $caseStudyData['project_id'] = $project->id;
                CaseStudy::create($caseStudyData);
            }

            return $project;
        });

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'CREATE_PROJECT',
            'model_type' => Project::class,
            'model_id' => $project->id,
            'new_values' => $project->load('caseStudy')->toArray(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Project and Case Study created successfully.',
            'data' => $project->load('caseStudy')
        ], 201);
    }

    /**
     * Display the specified project.
     */
    public function show(Project $project): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $project->load('caseStudy')
        ]);
    }

    /**
     * Update the specified project in storage.
     */
    public function update(Request $request, Project $project): JsonResponse
    {
        $oldValues = $project->load('caseStudy')->toArray();

        $validatedProject = $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'industry' => 'string|max:100',
            'cover_image' => 'nullable|string',
            'gallery' => 'nullable|array',
            'gallery.*' => 'string',
            'tech_stack' => 'array',
            'tech_stack.*' => 'string',
            'features' => 'array',
            'features.*' => 'string',
            'status' => 'string|in:draft,published,featured',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string',
        ]);

        $validatedCaseStudy = $request->validate([
            'case_study' => 'nullable|array',
            'case_study.statistics' => 'nullable|array',
            'case_study.results' => 'nullable|string',
            'case_study.challenges' => 'nullable|string',
            'case_study.solutions' => 'nullable|string',
            'case_study.client_feedback' => 'nullable|string',
            'case_study.client_author' => 'nullable|string',
            'case_study.client_role' => 'nullable|string',
        ]);

        if (isset($validatedProject['title'])) {
            $validatedProject['slug'] = Str::slug($validatedProject['title']);
        }

        DB::transaction(function () use ($project, $validatedProject, $validatedCaseStudy) {
            $project->update($validatedProject);

            if (isset($validatedCaseStudy['case_study'])) {
                $caseStudyData = $validatedCaseStudy['case_study'];
                CaseStudy::updateOrCreate(
                    ['project_id' => $project->id],
                    $caseStudyData
                );
            }
        });

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'UPDATE_PROJECT',
            'model_type' => Project::class,
            'model_id' => $project->id,
            'old_values' => $oldValues,
            'new_values' => $project->load('caseStudy')->toArray(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Project updated successfully.',
            'data' => $project->load('caseStudy')
        ]);
    }

    /**
     * Remove the specified project.
     */
    public function destroy(Request $request, Project $project): JsonResponse
    {
        $oldValues = $project->load('caseStudy')->toArray();

        DB::transaction(function () use ($project) {
            // Case study cascade delete is handled by database foreign key constraint
            $project->delete();
        });

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'DELETE_PROJECT',
            'model_type' => Project::class,
            'model_id' => $project->id,
            'old_values' => $oldValues,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Project and associated Case Study soft deleted successfully.'
        ]);
    }
}
