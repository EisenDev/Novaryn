<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\PricingPackage;
use App\Models\Project;
use App\Models\CaseStudy;
use App\Models\Setting;
use App\Models\Lead;
use App\Models\ContactMessage;
use App\Models\NewsletterSubscriber;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Default Users (Admins)
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@novaryn.tech',
            'password' => Hash::make('password123'),
            'role' => 'super_admin'
        ]);

        User::create([
            'name' => 'Sales Manager',
            'email' => 'sales@novaryn.tech',
            'password' => Hash::make('password123'),
            'role' => 'sales'
        ]);

        User::create([
            'name' => 'Lead Developer',
            'email' => 'dev@novaryn.tech',
            'password' => Hash::make('password123'),
            'role' => 'developer'
        ]);

        // 2. Create Pricing Packages
        PricingPackage::create([
            'name' => 'Starter',
            'setup_price' => '₱50,000 – ₱100,000',
            'monthly_price' => '₱10,000',
            'description' => 'Perfect for small businesses starting their digital journey.',
            'features' => [
                'Custom Website',
                'Booking System',
                'Admin Dashboard',
                'Payment Integration',
                'Basic Reports',
                'Email & Chat Support'
            ],
            'recommended' => false,
            'button_text' => 'Get Started',
            'sort_order' => 1,
            'visible' => true
        ]);

        PricingPackage::create([
            'name' => 'Professional',
            'setup_price' => '₱150,000 – ₱200,000',
            'monthly_price' => '₱15,000',
            'description' => 'Complete business platform for growing organizations.',
            'features' => [
                'Everything in Starter',
                'Membership Management',
                'QR Check-in',
                'Analytics & Reports',
                'Customer CRM',
                'Rewards & Loyalty',
                'Priority Support'
            ],
            'recommended' => true,
            'button_text' => 'Book a Consultation',
            'sort_order' => 2,
            'visible' => true
        ]);

        PricingPackage::create([
            'name' => 'Enterprise',
            'setup_price' => '₱350,000 – ₱750,000',
            'monthly_price' => '₱20,000 – ₱35,000',
            'description' => 'For multi-branch and enterprise organizations with advanced needs.',
            'features' => [
                'Unlimited Modules',
                'Multi-Branch Management',
                'Advanced Permissions',
                'ERP Integrations',
                'Dedicated Account Manager',
                'SLA & 24/7 Support',
                'Custom Development'
            ],
            'recommended' => false,
            'button_text' => 'Request a Proposal',
            'sort_order' => 3,
            'visible' => true
        ]);

        // 3. Create Sample Projects & Case Studies
        $project = Project::create([
            'title' => 'PaddleYard Platform',
            'slug' => 'paddleyard-platform',
            'description' => 'PaddleYard is a custom-coded business orchestration system built specifically for premium badminton and pickleball clubs. The system automates hourly court allocations, GCash payment clearances, walk-in reception counters, and member wallets.',
            'industry' => 'Sports Facilities',
            'cover_image' => '/paddleyard/LANDING.png',
            'gallery' => [
                '/paddleyard/LANDING.png',
                '/paddleyard/LOGIN.png',
                '/paddleyard/SIGNUP.png',
                '/paddleyard/ANALYTICS.png',
                '/paddleyard/BOOKING-MONITOR.png',
                '/paddleyard/PADDLESTACK.png'
            ],
            'tech_stack' => ['Next.js 16', 'TypeScript', 'Tailwind CSS v4', 'PostgreSQL', 'Prisma ORM', 'Docker', 'Auth.js'],
            'features' => [
                'Live Court Scheduling',
                'NextAuth Security Gate',
                'DUPR Player Rating Sync',
                'Digital Wallet Credits',
                'QR Paddle Stack Queue',
                'Loyalty Point Shop'
            ],
            'status' => 'featured',
            'seo_title' => 'PaddleYard Case Study - Sports Facility Management by Novaryn',
            'seo_description' => 'Explore how Novaryn engineered a custom, production-grade club orchestration system for sports facility owners in the Philippines.'
        ]);

        CaseStudy::create([
            'project_id' => $project->id,
            'statistics' => [
                ['label' => 'Time Saved', 'value' => '40%'],
                ['label' => 'Revenue Growth', 'value' => '2.5x'],
                ['label' => 'Active Members', 'value' => '1,200+'],
                ['label' => 'Court Bookings', 'value' => '15,000+']
            ],
            'results' => 'PaddleYard successfully automated 90% of front desk check-in operations. The introduction of digital player wallets boosted recurring bookings by 35% within the first month. In addition, real-time court scheduling eliminated booking conflicts entirely.',
            'challenges' => 'Managing walk-in players, scheduled events, and paddle queue check-ins (Paddle Stack) manually caused high wait times, transaction errors, and court under-utilization during off-peak hours.',
            'solutions' => 'We built a custom Next.js front-end mapped to a PostgreSQL backend via Prisma. We designed a virtual Paddle Stack queue matching players by their DUPR rating scores, backed by QR scanners at the court gate, and automated GCash wallet deposits.',
            'client_feedback' => 'The software Novaryn built has completely transformed how we run our sports arena. We went from messy spreadsheets and booking disputes to a fully automated system that our customers love.',
            'client_author' => 'Juan Dela Cruz',
            'client_role' => 'Founder & Owner, PaddleYard Philippines'
        ]);

        // 4. Create Website Settings
        Setting::setVal('company_name', 'Novaryn');
        Setting::setVal('logo_url', '/novaryn-logo.png');
        Setting::setVal('email', 'novaryntec@gmail.com');
        Setting::setVal('phone', '+63 917 123 4567');
        Setting::setVal('address', 'Makati City, Metro Manila, Philippines');
        Setting::setVal('seo_title', 'Novaryn | Premium Custom Software & Business Platforms');
        Setting::setVal('seo_description', 'Novaryn builds custom, high-fidelity business platforms, ERP suites, and digital scheduling systems. We help companies automate operations and scale with quality code.');
        Setting::setVal('manual_revenue', '₱845,000');

        // 5. Create Sample Leads
        Lead::create([
            'name' => 'Michael Chang',
            'company' => 'ActiveSports Gyms',
            'email' => 'michael@activesports.ph',
            'phone' => '09179998877',
            'industry' => 'Gyms',
            'budget' => '₱150,000 – ₱200,000',
            'timeline' => '1-2 months',
            'message' => 'Looking to build an internal app for member booking, trainer assignments, and RFID check-in integrations.',
            'status' => 'new',
            'source' => 'website'
        ]);

        Lead::create([
            'name' => 'Sophia Cruz',
            'company' => 'HeartCare Clinic Group',
            'email' => 'sophia@heartcare.com.ph',
            'phone' => '09221234567',
            'industry' => 'Clinics',
            'budget' => '₱350,000 – ₱750,000',
            'timeline' => '3+ months',
            'message' => 'We require a centralized clinic patient records CRM with automated SMS reminders and multi-branch calendars.',
            'status' => 'contacted',
            'source' => 'website'
        ]);

        Lead::create([
            'name' => 'Chef Andres',
            'company' => 'Bistro Group PH',
            'email' => 'andres@bistrogroup.ph',
            'phone' => '09458887766',
            'industry' => 'Restaurants',
            'budget' => '₱150,000 – ₱200,000',
            'timeline' => '2-3 months',
            'message' => 'We need a custom kitchen display monitor and table QR booking system to speed up orders.',
            'status' => 'meeting_scheduled',
            'source' => 'website'
        ]);

        // 6. Create Newsletter Subscribers
        NewsletterSubscriber::create(['email' => 'user1@gmail.com']);
        NewsletterSubscriber::create(['email' => 'user2@gmail.com']);

        // 7. Create Contact Messages
        ContactMessage::create([
            'name' => 'Ramon Santos',
            'email' => 'ramon@santos.ph',
            'subject' => 'Partnership Inquiry',
            'message' => 'Hello Novaryn, we are an IT consulting firm looking to outsource custom Next.js development projects. Let\'s connect.'
        ]);

        // 8. Seed Pricing Engine Plans
        $this->call(PlanSeeder::class);
    }
}
