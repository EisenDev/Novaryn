<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('plan_modules')
            ->where('name', 'like', '%Starter Host%')
            ->update(['monthly_price' => 35]);

        DB::table('plan_modules')
            ->where('name', 'like', '%Pro Host%')
            ->update(['monthly_price' => 100]);

        DB::table('plan_modules')
            ->where('name', 'like', '%Enterprise Host%')
            ->update(['monthly_price' => 330]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('plan_modules')
            ->where('name', 'like', '%Starter Host%')
            ->update(['monthly_price' => 35]);

        DB::table('plan_modules')
            ->where('name', 'like', '%Pro Host%')
            ->update(['monthly_price' => 105]);

        DB::table('plan_modules')
            ->where('name', 'like', '%Enterprise Host%')
            ->update(['monthly_price' => 350]);
    }
};
