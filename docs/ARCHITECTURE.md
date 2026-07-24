# Architecture Specifications

This document outlines the architectural patterns, layers, and communication boundaries governing the **Novaryn Internal Business Platform**.

---

## 🏗️ Monorepo Orchestration Diagram

```text
                        ┌──────────────────────────────┐
                        │   Next.js Marketing Website  │
                        │      (Public on Port 3000)   │
                        └──────────────┬───────────────┘
                                       │ (REST API Fetch v1)
                                       ▼
                        ┌──────────────────────────────┐
                        │       Laravel 13 API         │
                        │     (Private on Port 8000)   │
                        └──────────────┬───────────────┘
                                       │
                ┌──────────────────────┼──────────────────────┐
                ▼                      ▼                      ▼
    ┌──────────────────────┐ ┌──────────────────┐ ┌───────────────────────┐
    │  PostgreSQL Database │ │   Redis Server   │ │    SMTP/Mail Server   │
    │ (Datastore Port 5432)│ │(Queue Port 6379) │ │ (Resend Email Portal) │
    └──────────────────────┘ └──────────────────┘ └───────────────────────┘
```

---

## ⚡ Backend Architectural Patterns (Laravel)

To support long-term extensibility and keep the API codebase decoupling clean, we implement a strict **Repository Pattern** and **Service Layer** structure for all write-intensive core modules.

### Layer Hierarchy Flow:
1. **Routing Layer (`routes/api.php`)**: Maps requests to versioned HTTP controllers.
2. **Form Request Layer (`Http/Requests/*`)**: Handles request-level validation, authorization checks, and payload filtering before controllers execute.
3. **Controller Layer (`Http/Controllers/*`)**: Interacts solely with API HTTP inputs. Delegates business actions to the Service Layer and formats JSON responses using API Resources.
4. **Service Layer (`Services/*`)**: Contains the core business logic, status transitions, notifications dispatching (email/SMS), and event triggers.
5. **Repository Layer (`Repositories/*`)**: Standardizes data queries. Abstracts raw database operations so we can transition databases or apply Redis query caching layer easily.
6. **Model & DB Layer (`Models/*`, PostgreSQL)**: Defines relations, UUID key bindings, soft deletes, and casts.

```text
Client Request
      │
      ▼
┌───────────┐      ┌──────────────┐      ┌─────────────┐
│  Routing  ├─────►│ Form Request ├─────►│ Controller  │
└───────────┘      └──────────────┘      └──────┬──────┘
                                                │
                                                ▼
┌───────────┐      ┌──────────────┐      ┌─────────────┐
│ Database  │◄─────┤  Repository  │◄─────┤   Service   │
└───────────┘      └──────────────┘      └─────────────┘
```

---

## 🔒 Authentication & Role-Based Permissions

Admin access is secured using **Laravel Sanctum**. Administrative routes check active user tokens and enforce role middleware:

* **Super Admin**: Full platform authority (roles management, settings edits, system audit records).
* **Admin**: General platform operations (pricing CMS, team rosters, billing indicators).
* **Sales**: Focuses on the Lead pipelines, consultations logging, and won/lost metrics.
* **Developer**: Manages system integrations, API tokens, and webhook configs.
* **Marketing**: Manages blog posts, case studies, newsletter listings, and testimonials.

---

## 🐳 Caching and Queues (Redis)

We utilize Redis alpine containers for:
* **API Resource Caching**: Reduces database load for public-facing queries (pricing packages, FAQ list).
* **Queues**: Submitting leads immediately spawns a background job to send email notifications, preventing front-end network block.
* **Laravel Scheduler**: Runs cron loops checking scheduled blog postings and daily leads conversion logs.
