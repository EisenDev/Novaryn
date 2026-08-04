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
        Schema::create('quotations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('client_name');
            $table->string('client_email')->nullable();
            $table->string('client_phone')->nullable();
            $table->string('client_address')->nullable();
            $table->unsignedBigInteger('downpayment')->default(0);
            $table->foreignUuid('plan_id')->constrained('plans');
            $table->unsignedBigInteger('build_total');
            $table->unsignedBigInteger('monthly_total');
            $table->text('notes')->nullable();
            $table->boolean('include_maintenance')->default(true);
            $table->enum('status', ['draft', 'sent', 'accepted', 'declined'])->default('draft');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotations');
    }
};
