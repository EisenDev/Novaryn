# Database Schema Design

This document details the PostgreSQL table layouts, relationships, indexing strategies, and constraint definitions for the Novaryn Platform.

---

## 🔑 Core Schema Standards

1. **Primary Keys (UUIDv4)**: Every table uses UUIDs as primary keys, preventing key-enumeration security vulnerabilities and easing future multi-tenant replication.
2. **Soft Deletes**: Key records (`users`, `leads`, `projects`, `blog_posts`) implement `deleted_at` timestamps to preserve historical datasets and support admin recovery.
3. **Audit Trails**: Major mutations trigger a log entry containing old and new JSON payloads for system traceability.

---

## 🗄️ Database Tables Reference

### 1. Table: `users`
Stores administrative staff accounts.
* `id` (UUID, Primary Key)
* `name` (String, max 255)
* `email` (String, unique, index)
* `email_verified_at` (Timestamp, nullable)
* `password` (String, hashed)
* `role` (String, default 'sales') -- super_admin, admin, sales, developer, marketing
* `remember_token` (String, nullable)
* `timestamps`
* `deleted_at` (Timestamp, nullable)

### 2. Table: `leads`
Tracks consultation inquiries and pipeline stages.
* `id` (UUID, Primary Key)
* `name` (String, max 255)
* `company` (String, nullable)
* `email` (String, index)
* `phone` (String, nullable)
* `industry` (String, nullable)
* `budget` (String, nullable)
* `timeline` (String, nullable)
* `message` (Text, nullable)
* `status` (String, default 'new', index) -- new, contacted, meeting_scheduled, proposal_sent, negotiation, won, lost, archived
* `assigned_to` (UUID, Foreign Key -> users.id, nullable)
* `meeting_date` (DateTime, nullable)
* `notes` (Text, nullable)
* `source` (String, default 'website')
* `timestamps`
* `deleted_at` (Timestamp, nullable)

### 3. Table: `pricing_packages`
CMS packages dynamically served on the pricing grid.
* `id` (UUID, Primary Key)
* `name` (String)
* `setup_price` (String)
* `monthly_price` (String)
* `description` (Text, nullable)
* `features` (JSON) -- String array containing deliverables
* `recommended` (Boolean, default false)
* `button_text` (String, default 'Request Custom Proposal')
* `sort_order` (Integer, default 0)
* `visible` (Boolean, default true)
* `timestamps`

### 4. Table: `projects`
Showcase of completed development products.
* `id` (UUID, Primary Key)
* `title` (String)
* `slug` (String, unique, index)
* `description` (Text)
* `industry` (String)
* `cover_image` (String, nullable)
* `gallery` (JSON, nullable) -- Array of image asset URLs
* `tech_stack` (JSON) -- Array of string frameworks
* `features` (JSON) -- Array of module bullet strings
* `status` (String, default 'draft', index) -- draft, published, featured
* `seo_title` (String, nullable)
* `seo_description` (Text, nullable)
* `timestamps`
* `deleted_at` (Timestamp, nullable)

### 5. Table: `case_studies`
Detailed results sheet bound to projects.
* `id` (UUID, Primary Key)
* `project_id` (UUID, Foreign Key -> projects.id, cascade delete)
* `statistics` (JSON, nullable) -- Label-value metrics arrays
* `results` (Text, nullable)
* `challenges` (Text, nullable)
* `solutions` (Text, nullable)
* `client_feedback` (Text, nullable)
* `client_author` (String, nullable)
* `client_role` (String, nullable)
* `timestamps`

### 6. Table: `blog_posts`
Platform CMS posts.
* `id` (UUID, Primary Key)
* `title` (String)
* `slug` (String, unique, index)
* `content` (LongText)
* `summary` (Text, nullable)
* `featured_image` (String, nullable)
* `status` (String, default 'draft', index) -- draft, published, scheduled
* `published_at` (DateTime, nullable)
* `category` (String)
* `tags` (JSON, nullable) -- String arrays
* `seo_title` (String, nullable)
* `seo_description` (Text, nullable)
* `timestamps`
* `deleted_at` (Timestamp, nullable)

### 7. Table: `testimonials`
* `id` (UUID, Primary Key)
* `client_name` (String)
* `company` (String)
* `position` (String)
* `photo` (String, nullable)
* `rating` (Integer, default 5)
* `review` (Text)
* `featured` (Boolean, default false)
* `timestamps`

### 8. Table: `audit_logs`
Automated mutations logger.
* `id` (UUID, Primary Key)
* `user_id` (UUID, Foreign Key -> users.id, nullable)
* `action` (String) -- LOGIN, LOGOUT, CREATE_LEAD, etc.
* `model_type` (String, nullable)
* `model_id` (UUID, nullable)
* `old_values` (JSON, nullable)
* `new_values` (JSON, nullable)
* `ip_address` (String, nullable)
* `user_agent` (Text, nullable)
* `created_at` (Timestamp, useCurrent)

### 9. Table: `settings`
Global website configurations database.
* `id` (UUID, Primary Key)
* `key` (String, unique, index)
* `value` (Text, nullable)
* `timestamps`

### 10. Table: `contact_messages`
General site inquiries.
* `id` (UUID, Primary Key)
* `name` (String)
* `email` (String)
* `subject` (String, nullable)
* `message` (Text)
* `status` (String, default 'unread') -- unread, read, archived, spam
* `timestamps`

### 11. Table: `newsletter_subscribers`
* `id` (UUID, Primary Key)
* `email` (String, unique)
* `active` (Boolean, default true)
* `timestamps`
