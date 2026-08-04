<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add is_viewed flag to leads for badge indicator
        Schema::table('leads', function (Blueprint $table) {
            $table->boolean('is_viewed')->default(false)->after('status');
        });

        // Add pending deletion fields to quotations for safe deletion workflow
        Schema::table('quotations', function (Blueprint $table) {
            $table->timestamp('pending_deletion_at')->nullable()->after('status');
            $table->string('pending_deletion_by')->nullable()->after('pending_deletion_at'); // admin name
            $table->string('pending_deletion_reason')->nullable()->after('pending_deletion_by');
        });
    }

    public function down(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->dropColumn('is_viewed');
        });
        Schema::table('quotations', function (Blueprint $table) {
            $table->dropColumn(['pending_deletion_at', 'pending_deletion_by', 'pending_deletion_reason']);
        });
    }
};
