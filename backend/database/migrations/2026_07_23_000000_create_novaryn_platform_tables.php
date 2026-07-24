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
        // 1. Leads Table
        Schema::create('leads', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('company')->nullable();
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('industry')->nullable();
            $table->string('budget')->nullable();
            $table->string('timeline')->nullable();
            $table->text('message')->nullable();
            $table->string('status')->default('new'); // new, contacted, meeting_scheduled, proposal_sent, negotiation, won, lost, archived
            $table->uuid('assigned_to')->nullable();
            $table->dateTime('meeting_date')->nullable();
            $table->text('notes')->nullable();
            $table->string('source')->default('website');
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('email');
        });

        // 2. Pricing Packages Table
        Schema::create('pricing_packages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('setup_price');
            $table->string('monthly_price');
            $table->text('description')->nullable();
            $table->json('features');
            $table->boolean('recommended')->default(false);
            $table->string('button_text')->default('Request Custom Proposal');
            $table->integer('sort_order')->default(0);
            $table->boolean('visible')->default(true);
            $table->timestamps();
        });

        // 3. Projects Table
        Schema::create('projects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('industry');
            $table->string('cover_image')->nullable();
            $table->json('gallery')->nullable();
            $table->json('tech_stack');
            $table->json('features');
            $table->string('status')->default('draft'); // draft, published, featured
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('slug');
        });

        // 4. Case Studies Table
        Schema::create('case_studies', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id');
            $table->json('statistics')->nullable();
            $table->text('results')->nullable();
            $table->text('challenges')->nullable();
            $table->text('solutions')->nullable();
            $table->text('client_feedback')->nullable();
            $table->string('client_author')->nullable();
            $table->string('client_role')->nullable();
            $table->timestamps();

            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
        });

        // 5. Blog Posts Table
        Schema::create('blog_posts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('content');
            $table->text('summary')->nullable();
            $table->string('featured_image')->nullable();
            $table->string('status')->default('draft'); // draft, published, scheduled
            $table->dateTime('published_at')->nullable();
            $table->string('category');
            $table->json('tags')->nullable();
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('slug');
        });

        // 6. Testimonials Table
        Schema::create('testimonials', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('client_name');
            $table->string('company');
            $table->string('position');
            $table->string('photo')->nullable();
            $table->integer('rating')->default(5);
            $table->text('review');
            $table->boolean('featured')->default(false);
            $table->timestamps();
        });

        // 7. Audit Logs Table
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->nullable();
            $table->string('action'); // LOGIN, CREATE, UPDATE, DELETE, SETTING_CHANGE
            $table->string('model_type')->nullable();
            $table->uuid('model_id')->nullable();
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });

        // 8. Settings Table
        Schema::create('settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        // 9. Contact Messages Table
        Schema::create('contact_messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('email');
            $table->string('subject')->nullable();
            $table->text('message');
            $table->string('status')->default('unread'); // unread, read, archived, spam
            $table->timestamps();
        });

        // 10. Newsletter Subscribers Table
        Schema::create('newsletter_subscribers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('email')->unique();
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('newsletter_subscribers');
        Schema::dropIfExists('contact_messages');
        Schema::dropIfExists('settings');
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('blog_posts');
        Schema::dropIfExists('case_studies');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('pricing_packages');
        Schema::dropIfExists('leads');
    }
};
