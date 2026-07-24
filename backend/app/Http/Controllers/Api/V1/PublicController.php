<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubmitLeadRequest;
use App\Models\Lead;
use App\Models\PricingPackage;
use App\Models\Project;
use App\Models\Testimonial;
use App\Models\Setting;
use App\Models\ContactMessage;
use App\Models\NewsletterSubscriber;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    /**
     * Get active pricing packages.
     */
    public function pricing(): JsonResponse
    {
        $packages = PricingPackage::where('visible', true)
            ->orderBy('sort_order', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $packages
        ]);
    }

    /**
     * Get published projects.
     */
    public function projects(): JsonResponse
    {
        $projects = Project::whereIn('status', ['published', 'featured'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $projects
        ]);
    }

    /**
     * Get a single project with its case study.
     */
    public function projectDetails(string $slug): JsonResponse
    {
        $project = Project::where('slug', $slug)
            ->whereIn('status', ['published', 'featured'])
            ->with('caseStudy')
            ->first();

        if (!$project) {
            return response()->json([
                'status' => 'error',
                'message' => 'Project not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $project
        ]);
    }

    /**
     * Get featured testimonials.
     */
    public function testimonials(): JsonResponse
    {
        $testimonials = Testimonial::where('featured', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $testimonials
        ]);
    }

    /**
     * Get FAQs list.
     */
    public function faqs(): JsonResponse
    {
        $faqs = json_decode(Setting::getVal('faqs', '[]'), true);

        // Fallback polished FAQs matching our website copy
        if (empty($faqs)) {
            $faqs = [
                [
                    "question" => "What kind of platforms do you build?",
                    "answer" => "We design and engineer bespoke software platforms tailored to your business operations. Examples include facility booking applications, digital customer wallets, clinic patient schedules, and specialized restaurant systems."
                ],
                [
                    "question" => "Who owns the code once the project is finished?",
                    "answer" => "You do. We build proprietary assets for our clients. Once deployment is complete and contracts are closed, all source files, intellectual properties, and server ownership are handed over to you."
                ],
                [
                    "question" => "How long does a typical custom platform build take?",
                    "answer" => "Most medium-sized platforms are deployed in 8 to 12 weeks. We follow a milestone-based sprint methodology with weekly review calls to maintain high momentum."
                ],
                [
                    "question" => "Do you support the software after deployment?",
                    "answer" => "Yes. Every build comes with a standard 30-day post-launch hot-fix support period. We also offer dedicated monthly support SLAs that cover hosting management, updates, backups, and minor enhancements."
                ],
                [
                    "question" => "How much input do we need to provide during the process?",
                    "answer" => "Your input is critical during the discovery and feedback stages. We conduct detailed architectural requirements workshops at the start and require review approvals after each sprint milestone."
                ]
            ];
        }

        return response()->json([
            'status' => 'success',
            'data' => $faqs
        ]);
    }

    /**
     * Get general SEO and social website settings.
     */
    public function settings(): JsonResponse
    {
        $keys = ['company_name', 'logo_url', 'email', 'phone', 'address', 'social_links', 'seo_title', 'seo_description'];
        $settings = [];
        
        foreach ($keys as $key) {
            $settings[$key] = Setting::getVal($key);
        }

        // Apply sensible fallbacks
        $settings['company_name'] = $settings['company_name'] ?? 'Novaryn';
        $settings['email'] = $settings['email'] ?? 'novaryntec@gmail.com';
        
        return response()->json([
            'status' => 'success',
            'data' => $settings
        ]);
    }

    /**
     * Submit lead consultation inquiry.
     */
    public function submitLead(SubmitLeadRequest $request): JsonResponse
    {
        $lead = Lead::create($request->validated());

        // Log audit log event
        AuditLog::create([
            'action' => 'LEAD_SUBMISSION',
            'model_type' => Lead::class,
            'model_id' => $lead->id,
            'new_values' => $lead->toArray(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        // Here we would dispatch emails via Resend or generic Laravel mailers:
        // Mail::to($lead->email)->send(new LeadConfirmationMail($lead));
        // Mail::to('novaryntec@gmail.com')->send(new AdminLeadNotificationMail($lead));

        return response()->json([
            'status' => 'success',
            'message' => 'Consultation inquiry submitted successfully.',
            'lead_id' => $lead->id
        ], 201);
    }

    /**
     * Submit general contact inquiry.
     */
    public function submitContact(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        $msg = ContactMessage::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Contact message sent successfully.',
            'message_id' => $msg->id
        ], 201);
    }

    /**
     * Subscribe to newsletter list.
     */
    public function subscribeNewsletter(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
        ]);

        $subscriber = NewsletterSubscriber::updateOrCreate(
            ['email' => $validated['email']],
            ['active' => true]
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Subscribed to newsletter list successfully.',
            'subscriber_id' => $subscriber->id
        ]);
    }
}
