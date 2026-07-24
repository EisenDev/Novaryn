<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('plan_modules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('plan_id')->constrained('plans')->cascadeOnDelete();
            $table->string('category'); // 'build' or 'support'
            $table->string('name');
            $table->unsignedBigInteger('build_price')->default(0);
            $table->unsignedBigInteger('monthly_price')->default(0);
            $table->unsignedTinyInteger('complexity_score')->default(1);
            $table->boolean('is_required')->default(false);
            $table->boolean('enabled_by_default')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plan_modules');
    }
};
