<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // STARTER PLAN
        $starter = Plan::create([
            'name' => 'Starter',
            'slug' => 'starter',
            'minimum_build_price' => 20000,
            'minimum_monthly_price' => 5000,
            'sort_order' => 1,
        ]);

        $starterBuildModules = [
            ['name' => 'Custom Brand Website', 'build_price' => 8000, 'monthly_price' => 300, 'complexity_score' => 4, 'is_required' => false, 'enabled_by_default' => true],
            ['name' => 'Online Booking Engine', 'build_price' => 18000, 'monthly_price' => 800, 'complexity_score' => 8, 'is_required' => false, 'enabled_by_default' => true],
            ['name' => 'Responsive UI', 'build_price' => 5000, 'monthly_price' => 200, 'complexity_score' => 3, 'is_required' => false, 'enabled_by_default' => true],
            ['name' => 'Admin Dashboard', 'build_price' => 12000, 'monthly_price' => 600, 'complexity_score' => 6, 'is_required' => false, 'enabled_by_default' => true],
            ['name' => 'User Accounts', 'build_price' => 8000, 'monthly_price' => 300, 'complexity_score' => 4, 'is_required' => false, 'enabled_by_default' => true],
            ['name' => 'Booking Calendar', 'build_price' => 10000, 'monthly_price' => 500, 'complexity_score' => 5, 'is_required' => false, 'enabled_by_default' => true],
            ['name' => 'GCash / Maya Payments', 'build_price' => 12000, 'monthly_price' => 700, 'complexity_score' => 6, 'is_required' => false, 'enabled_by_default' => true],
            ['name' => 'QR Code Check-in', 'build_price' => 8000, 'monthly_price' => 400, 'complexity_score' => 3, 'is_required' => false, 'enabled_by_default' => true],
            ['name' => 'Automated Email Alerts', 'build_price' => 4000, 'monthly_price' => 200, 'complexity_score' => 2, 'is_required' => false, 'enabled_by_default' => true],
            ['name' => 'Basic Analytics', 'build_price' => 7000, 'monthly_price' => 300, 'complexity_score' => 3, 'is_required' => false, 'enabled_by_default' => true],
            ['name' => 'Reports & Data Export', 'build_price' => 8000, 'monthly_price' => 400, 'complexity_score' => 4, 'is_required' => false, 'enabled_by_default' => true],
        ];

        foreach ($starterBuildModules as $module) {
            $starter->modules()->create(array_merge($module, ['category' => 'build']));
        }

        $starterSupportModules = [
            ['name' => 'Standard Cloud Hosting', 'monthly_price' => 1500, 'is_required' => true],
            ['name' => 'Active Server Monitoring', 'monthly_price' => 700, 'is_required' => true],
            ['name' => 'Monthly Security Updates', 'monthly_price' => 900, 'is_required' => false],
            ['name' => 'Weekly Server Backups', 'monthly_price' => 600, 'is_required' => false],
            ['name' => 'Email & Chat Tech Support', 'monthly_price' => 800, 'is_required' => false],
            ['name' => 'Infrastructure Maintenance', 'monthly_price' => 2000, 'is_required' => false],
            ['name' => 'Performance Audit', 'monthly_price' => 3500, 'is_required' => false],
        ];

        foreach ($starterSupportModules as $module) {
            $starter->modules()->create(array_merge($module, ['category' => 'support', 'build_price' => 0, 'complexity_score' => 1, 'enabled_by_default' => true]));
        }

        // PROFESSIONAL PLAN
        $professional = Plan::create([
            'name' => 'Professional',
            'slug' => 'professional',
            'minimum_build_price' => 30000,
            'minimum_monthly_price' => 8000,
            'sort_order' => 2,
        ]);

        $professionalBuildModules = [
            ['name' => 'Everything in Starter', 'build_price' => 0, 'monthly_price' => 0, 'complexity_score' => 0, 'is_required' => true, 'enabled_by_default' => true],
            ['name' => 'Unlimited Facility Modules', 'build_price' => 20000, 'monthly_price' => 1000, 'complexity_score' => 7, 'is_required' => false, 'enabled_by_default' => true],
            ['name' => 'Tiered Membership System', 'build_price' => 15000, 'monthly_price' => 800, 'complexity_score' => 6, 'is_required' => false, 'enabled_by_default' => true],
            ['name' => 'Customer CRM', 'build_price' => 25000, 'monthly_price' => 1200, 'complexity_score' => 10, 'is_required' => false, 'enabled_by_default' => true],
            ['name' => 'Open Play Reservation Logic', 'build_price' => 12000, 'monthly_price' => 600, 'complexity_score' => 5, 'is_required' => false, 'enabled_by_default' => true],
            ['name' => 'Loyalty & Rewards System', 'build_price' => 10000, 'monthly_price' => 500, 'complexity_score' => 5, 'is_required' => false, 'enabled_by_default' => true],
            ['name' => 'Point-of-Sale Module', 'build_price' => 18000, 'monthly_price' => 900, 'complexity_score' => 7, 'is_required' => false, 'enabled_by_default' => true],
            ['name' => 'Prepaid Credits & Wallet', 'build_price' => 15000, 'monthly_price' => 800, 'complexity_score' => 7, 'is_required' => false, 'enabled_by_default' => true],
            ['name' => 'Analytics & Reports', 'build_price' => 12000, 'monthly_price' => 600, 'complexity_score' => 6, 'is_required' => false, 'enabled_by_default' => true],
            ['name' => 'QR Check-in Advanced', 'build_price' => 10000, 'monthly_price' => 500, 'complexity_score' => 4, 'is_required' => false, 'enabled_by_default' => true],
            ['name' => 'Priority Support Ticketing', 'build_price' => 13000, 'monthly_price' => 600, 'complexity_score' => 3, 'is_required' => false, 'enabled_by_default' => true],
        ];

        foreach ($professionalBuildModules as $module) {
            $professional->modules()->create(array_merge($module, ['category' => 'build']));
        }

        $professionalSupportModules = [
            ['name' => 'High-Performance CDN Hosting', 'monthly_price' => 2500, 'is_required' => true],
            ['name' => 'Priority SLA Support', 'monthly_price' => 2000, 'is_required' => false],
            ['name' => 'Monthly Code & Feature Updates', 'monthly_price' => 3000, 'is_required' => false],
            ['name' => 'Server Uptime Optimizations', 'monthly_price' => 2000, 'is_required' => false],
            ['name' => 'Daily Encrypted DB Backups', 'monthly_price' => 2000, 'is_required' => false],
            ['name' => 'Live Security Threat Scanning', 'monthly_price' => 1500, 'is_required' => false],
            ['name' => 'Complete Hosting Management', 'monthly_price' => 2000, 'is_required' => false],
        ];

        foreach ($professionalSupportModules as $module) {
            $professional->modules()->create(array_merge($module, ['category' => 'support', 'build_price' => 0, 'complexity_score' => 1, 'enabled_by_default' => true]));
        }

        // ENTERPRISE PLAN
        $enterprise = Plan::create([
            'name' => 'Enterprise',
            'slug' => 'enterprise',
            'minimum_build_price' => 50000,
            'minimum_monthly_price' => 10000,
            'sort_order' => 3,
        ]);

        $enterpriseBuildModules = [
            ['name' => 'Everything in Professional', 'build_price' => 0, 'monthly_price' => 0, 'complexity_score' => 0, 'is_required' => true, 'enabled_by_default' => true],
            ['name' => 'Multi-Branch Administration', 'build_price' => 50000, 'monthly_price' => 3000, 'complexity_score' => 10, 'is_required' => false, 'enabled_by_default' => true],
            ['name' => 'Franchise Network Modules', 'build_price' => 40000, 'monthly_price' => 2500, 'complexity_score' => 10, 'is_required' => false, 'enabled_by_default' => true],
            ['name' => 'HQ Central Operations Panel', 'build_price' => 50000, 'monthly_price' => 3000, 'complexity_score' => 10, 'is_required' => false, 'enabled_by_default' => true],
            ['name' => 'Custom Active Directory Roles', 'build_price' => 30000, 'monthly_price' => 1500, 'complexity_score' => 8, 'is_required' => false, 'enabled_by_default' => true],
            ['name' => 'Custom ERP Integrations', 'build_price' => 80000, 'monthly_price' => 5000, 'complexity_score' => 10, 'is_required' => false, 'enabled_by_default' => true],
            ['name' => 'Business Intelligence Dashboards', 'build_price' => 60000, 'monthly_price' => 4000, 'complexity_score' => 10, 'is_required' => false, 'enabled_by_default' => true],
            ['name' => 'Live Barcode Inventory Tracks', 'build_price' => 40000, 'monthly_price' => 2500, 'complexity_score' => 7, 'is_required' => false, 'enabled_by_default' => true],
            ['name' => 'Oracle / SAP System Syncs', 'build_price' => 80000, 'monthly_price' => 5000, 'complexity_score' => 10, 'is_required' => false, 'enabled_by_default' => true],
            ['name' => 'Dedicated DevOps SLA', 'build_price' => 50000, 'monthly_price' => 3000, 'complexity_score' => 8, 'is_required' => false, 'enabled_by_default' => true],
        ];

        foreach ($enterpriseBuildModules as $module) {
            $enterprise->modules()->create(array_merge($module, ['category' => 'build']));
        }

        $enterpriseSupportModules = [
            ['name' => 'Dedicated Bare-Metal Hosting', 'monthly_price' => 5000, 'is_required' => true],
            ['name' => 'Full Legacy DB Migration', 'monthly_price' => 4000, 'is_required' => false],
            ['name' => 'Dedicated DevOps Engineer SLA', 'monthly_price' => 6000, 'is_required' => false],
            ['name' => '99.99% Node Uptime Guarantee', 'monthly_price' => 3000, 'is_required' => false],
            ['name' => '24/7 Phone Incident Hotline', 'monthly_price' => 5000, 'is_required' => false],
            ['name' => 'Custom Corporate SLA Agreements', 'monthly_price' => 5000, 'is_required' => false],
        ];

        foreach ($enterpriseSupportModules as $module) {
            $enterprise->modules()->create(array_merge($module, ['category' => 'support', 'build_price' => 0, 'complexity_score' => 1, 'enabled_by_default' => true]));
        }
    }
}
