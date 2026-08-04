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
use Illuminate\Support\Facades\Http;

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

        // Send confirmation email to client
        $clientSubject = "We received your consultation request! - Novaryn Tech";
        $clientHtml = '
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #047857; margin-top: 10px;">Consultation Request Received!</h2>
            </div>
            <p>Dear <strong>' . htmlspecialchars($lead->name) . '</strong>,</p>
            <p>Thank you for booking a consultation with <strong>Novaryn Tech Solutions</strong>.</p>
            <p>Our project delivery team is reviewing your project details. We will reach out to you within the next 24 hours to schedule a Google Meet or physical meetup.</p>
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #1f2937;">Your Inquiry Summary:</h4>
                <p style="margin: 5px 0;"><strong>Name:</strong> ' . htmlspecialchars($lead->name) . '</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ' . htmlspecialchars($lead->email) . '</p>
                <p style="margin: 5px 0;"><strong>Phone:</strong> ' . htmlspecialchars($lead->phone ?? 'Not provided') . '</p>
                <p style="margin: 5px 0;"><strong>Description:</strong> ' . nl2br(htmlspecialchars($lead->message ?? 'No details provided')) . '</p>
            </div>
            <p style="color: #6b7280; font-size: 11px; text-align: center; margin-top: 30px;">
                Novaryn Tech Solutions · Digos City, Davao del Sur, Philippines
            </p>
        </div>';
        $this->sendResendEmail($lead->email, $clientSubject, $clientHtml);

        // Send notification emails to admin personnel
        $adminEmails = explode(',', env('RESEND_TO_EMAILS', 'novaryntec@gmail.com'));
        $adminSubject = "New Consultation Booking: " . $lead->name;
        $adminHtml = '
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #111827; margin-top: 10px;">New Consultation Request</h2>
                <p style="color: #047857; font-weight: bold;">Novaryn Lead Management</p>
            </div>
            <p>Hello Team,</p>
            <p>A new consultation inquiry has been submitted through the website landing page.</p>
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #047857;">
                <h4 style="margin-top: 0; color: #1f2937;">Client Details:</h4>
                <p style="margin: 5px 0;"><strong>Name:</strong> ' . htmlspecialchars($lead->name) . '</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ' . htmlspecialchars($lead->email) . '</p>
                <p style="margin: 5px 0;"><strong>Phone:</strong> ' . htmlspecialchars($lead->phone ?? 'Not provided') . '</p>
                <p style="margin: 10px 0 5px 0;"><strong>Project Description:</strong></p>
                <blockquote style="margin: 0; padding: 10px; background-color: #f3f4f6; border-radius: 4px; font-style: italic;">
                    ' . nl2br(htmlspecialchars($lead->message ?? 'No details provided')) . '
                </blockquote>
            </div>
            <p>Please log in to the dashboard to review this lead and schedule a discussion session.</p>
            <p style="color: #6b7280; font-size: 11px; text-align: center; margin-top: 30px;">
                Novaryn Tech Solutions · Digos City, Davao del Sur, Philippines
            </p>
        </div>';

        foreach ($adminEmails as $adminEmail) {
            $trimmed = trim($adminEmail);
            if (!empty($trimmed)) {
                $this->sendResendEmail($trimmed, $adminSubject, $adminHtml);
            }
        }

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

    /**
     * Verify if there is a pending lead with the specified email.
     */
    public function verifyLead(Request $request): JsonResponse
    {
        $email = $request->query('email');
        if (empty($email)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email parameter is required.'
            ], 400);
        }

        // Find active lead with this email that is not completed/archived
        $lead = Lead::where('email', trim($email))
            ->whereNotIn('status', ['completed', 'archived'])
            ->first();

        if (!$lead) {
            return response()->json([
                'status' => 'error',
                'message' => 'No active inquiry found for this email address.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'id' => $lead->id,
                'name' => $lead->name,
                'email' => $lead->email,
                'status' => $lead->status,
                'meeting_date' => $lead->meeting_date
            ]
        ]);
    }

    /**
     * Set preferred meeting date and details for public scheduler link.
     */
    public function scheduleLead(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'meeting_date' => 'required|date',
            'meeting_type' => 'required|string|in:google_meet,physical',
            'notes' => 'nullable|string|max:1000'
        ]);

        $lead = Lead::where('email', trim($validated['email']))
            ->whereNotIn('status', ['completed', 'archived'])
            ->first();

        if (!$lead) {
            return response()->json([
                'status' => 'error',
                'message' => 'No active inquiry found for scheduling.'
            ], 404);
        }

        // Format visual notes for team: "[Google Meet / Zoom] + additional notes"
        $notesString = '[' . strtoupper(str_replace('_', ' ', $validated['meeting_type'])) . ']';
        if (!empty($validated['notes'])) {
            $notesString .= ' - ' . $validated['notes'];
        }

        $lead->update([
            'meeting_date' => $validated['meeting_date'],
            'notes' => $notesString,
            'status' => 'meeting_scheduled'
        ]);

        // Send confirmation email via Resend to the client
        $clientSubject = "Consultation Scheduled! - Novaryn Tech";
        $meetingFormatted = date('M d, Y \a\t h:i A', strtotime($validated['meeting_date']));
        $meetingFormatLabel = $validated['meeting_type'] === 'google_meet' ? 'Google Meet (Online Video Call)' : 'Physical Meetup (Digos City Office/Cafe)';
        
        $clientHtml = '
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #047857; margin-top: 10px;">Consultation Confirmed!</h2>
            </div>
            <p>Dear <strong>' . htmlspecialchars($lead->name) . '</strong>,</p>
            <p>Your consultation meeting has been successfully booked with the Novaryn engineering team.</p>
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #047857;">
                <h4 style="margin-top: 0; color: #1f2937;">Meeting Information:</h4>
                <p style="margin: 5px 0;"><strong>Date & Time:</strong> ' . $meetingFormatted . ' (Philippine Time)</p>
                <p style="margin: 5px 0;"><strong>Format:</strong> ' . $meetingFormatLabel . '</p>
                ' . ($validated['meeting_type'] === 'google_meet' ? '<p style="margin: 5px 0; color: #047857;"><strong>Google Meet link:</strong> We will send a calendar link to your email shortly.</p>' : '<p style="margin: 5px 0;"><strong>Location:</strong> Digos City, Davao del Sur</p>') . '
            </div>
            <p>If you need to reschedule or have additional materials to share, please reply directly to this email.</p>
            <p style="color: #6b7280; font-size: 11px; text-align: center; margin-top: 30px;">
                Novaryn Tech Solutions · Digos City, Davao del Sur, Philippines
            </p>
        </div>';
        $this->sendResendEmail($lead->email, $clientSubject, $clientHtml);

        // Send notification email to admin personnel
        $adminEmails = explode(',', env('RESEND_TO_EMAILS', 'novaryntec@gmail.com'));
        $adminSubject = "Consultation Booked: " . $lead->name;
        $adminHtml = '
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #111827; margin-top: 10px;">Meeting Scheduled by Client</h2>
                <p style="color: #047857; font-weight: bold;">Novaryn Lead Management</p>
            </div>
            <p>Hello Team,</p>
            <p>The client has selected their preferred time for the consultation.</p>
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #047857;">
                <h4 style="margin-top: 0; color: #1f2937;">Details:</h4>
                <p style="margin: 5px 0;"><strong>Client Name:</strong> ' . htmlspecialchars($lead->name) . '</p>
                <p style="margin: 5px 0;"><strong>Scheduled Time:</strong> ' . $meetingFormatted . '</p>
                <p style="margin: 5px 0;"><strong>Meeting Format:</strong> ' . $meetingFormatLabel . '</p>
                <p style="margin: 5px 0;"><strong>Client Notes:</strong> ' . htmlspecialchars($validated['notes'] ?? 'None provided') . '</p>
            </div>
            <p>Please log in to the dashboard to prepare any materials or generate the meeting invitation link.</p>
            <p style="color: #6b7280; font-size: 11px; text-align: center; margin-top: 30px;">
                Novaryn Tech Solutions · Digos City, Davao del Sur, Philippines
            </p>
        </div>';

        foreach ($adminEmails as $adminEmail) {
            $trimmed = trim($adminEmail);
            if (!empty($trimmed)) {
                $this->sendResendEmail($trimmed, $adminSubject, $adminHtml);
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Meeting scheduled successfully.',
            'data' => $lead
        ]);
    }

    /**
     * Send email via Resend API
     */
    protected function sendResendEmail(string $to, string $subject, string $htmlContent): bool
    {
        $apiKey = env('RESEND_API_KEY');
        if (empty($apiKey) || $apiKey === 're_your_api_key_here') {
            \Log::info("Resend API Key is empty or placeholder. Logging email content instead: To: $to, Subject: $subject");
            return false;
        }

        $from = env('RESEND_FROM_EMAIL', 'onboarding@resend.dev');

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->post('https://api.resend.com/emails', [
                'from' => 'Novaryn Tech <' . $from . '>',
                'to' => [$to],
                'subject' => $subject,
                'html' => $htmlContent,
            ]);

            if ($response->successful()) {
                return true;
            }

            \Log::error("Resend API failed: " . $response->body());
            return false;
        } catch (\Exception $e) {
            \Log::error("Exception when calling Resend API: " . $e->getMessage());
            return false;
        }
    }
}
