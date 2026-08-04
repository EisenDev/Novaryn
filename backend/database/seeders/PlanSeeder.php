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
        // 1. Create or Update the single Plan representing the Custom Software Builder
        $customPlan = Plan::updateOrCreate(
            ['slug' => 'custom'],
            [
                'name' => 'Custom System Builder',
                'minimum_build_price' => 0,
                'minimum_monthly_price' => 0,
                'sort_order' => 1,
            ]
        );

        // 2. Build Modules (One-time build price + Monthly Maintenance cost)
        $buildModules = [
            // Starter modules
            [
                'name' => 'Appointment & Slot Booking',
                'build_price' => 85000,
                'monthly_price' => 3500,
                'complexity_score' => 5,
                'is_required' => false,
                'enabled_by_default' => false,
                'sort_order' => 20,
            ],
            [
                'name' => 'Standalone POS (Point of Sale)',
                'build_price' => 100000,
                'monthly_price' => 4000,
                'complexity_score' => 5,
                'is_required' => false,
                'enabled_by_default' => false,
                'sort_order' => 30,
            ],
            // Professional modules
            [
                'name' => 'Small Inventory System',
                'build_price' => 100000,
                'monthly_price' => 5000,
                'complexity_score' => 6,
                'is_required' => false,
                'enabled_by_default' => false,
                'sort_order' => 40,
            ],
            [
                'name' => 'Customer CRM & Membership Wallet',
                'build_price' => 90000,
                'monthly_price' => 4500,
                'complexity_score' => 6,
                'is_required' => false,
                'enabled_by_default' => false,
                'sort_order' => 50,
            ],
            [
                'name' => 'E-Commerce Online Store',
                'build_price' => 130000,
                'monthly_price' => 6000,
                'complexity_score' => 7,
                'is_required' => false,
                'enabled_by_default' => false,
                'sort_order' => 60,
            ],
            [
                'name' => 'Venue / Facility Booking Grid',
                'build_price' => 120000,
                'monthly_price' => 5500,
                'complexity_score' => 7,
                'is_required' => false,
                'enabled_by_default' => false,
                'sort_order' => 70,
            ],
            [
                'name' => 'MIS Dashboard & Custom Reports',
                'build_price' => 140000,
                'monthly_price' => 7000,
                'complexity_score' => 8,
                'is_required' => false,
                'enabled_by_default' => false,
                'sort_order' => 80,
            ],
            // Enterprise modules
            [
                'name' => 'Big Inventory & Supply Chain',
                'build_price' => 450000,
                'monthly_price' => 18000,
                'complexity_score' => 9,
                'is_required' => false,
                'enabled_by_default' => false,
                'sort_order' => 90,
            ],
            [
                'name' => 'Franchise & Branch HQ Panel',
                'build_price' => 350000,
                'monthly_price' => 15000,
                'complexity_score' => 9,
                'is_required' => false,
                'enabled_by_default' => false,
                'sort_order' => 100,
            ],
            [
                'name' => 'Enterprise ERP & Legacy Integration',
                'build_price' => 600000,
                'monthly_price' => 25000,
                'complexity_score' => 10,
                'is_required' => false,
                'enabled_by_default' => false,
                'sort_order' => 110,
            ],
        ];

        foreach ($buildModules as $module) {
            $customPlan->modules()->updateOrCreate(
                ['name' => $module['name']],
                array_merge($module, ['category' => 'build'])
            );
        }

        // 3. Support Modules — stored in USD (monthly_price = USD amount)
        //    Display layer converts to PHP using live exchange rate
        $supportModules = [
            [
                'name' => 'Basic Server & DB (Starter Host)',
                'build_price' => 0,
                'monthly_price' => 35,   // $35 USD/mo
                'complexity_score' => 1,
                'is_required' => false,
                'enabled_by_default' => false,
                'sort_order' => 200,
            ],
            [
                'name' => 'Advanced Server & DB (Pro Host)',
                'build_price' => 0,
                'monthly_price' => 100,  // $100 USD/mo
                'complexity_score' => 1,
                'is_required' => false,
                'enabled_by_default' => false,
                'sort_order' => 210,
            ],
            [
                'name' => 'High-Availability Cloud Network (Enterprise Host)',
                'build_price' => 0,
                'monthly_price' => 330,  // $330 USD/mo
                'complexity_score' => 1,
                'is_required' => false,
                'enabled_by_default' => false,
                'sort_order' => 220,
            ],
        ];

        foreach ($supportModules as $module) {
            $customPlan->modules()->updateOrCreate(
                ['name' => $module['name']],
                array_merge($module, ['category' => 'support'])
            );
        }
    }
}
