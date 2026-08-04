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
        Schema::table('projects', function (Blueprint $table) {
            $table->string('client_name')->nullable();
            $table->string('stage')->default('Discovery');
            $table->integer('progress')->default(0);
            $table->string('repo_url')->nullable();
            $table->string('dev_lead')->nullable();
            $table->json('module_config')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['client_name', 'stage', 'progress', 'repo_url', 'dev_lead', 'module_config']);
        });
    }
};
