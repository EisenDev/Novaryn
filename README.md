# Novaryn Business Operating System

Welcome to the central monorepo of **Novaryn**, the platform powering our internal agency operations. This repository contains the public marketing website and our internal operating system (CRM + CMS + Admin Portal) used to manage leads, projects, case studies, website settings, and audits.

---

## ├── Repository Architecture

```text
novaryn/
├── frontend/              # Next.js Marketing Website
├── backend/               # Laravel 13 API (PHP 8.4)
├── admin/                 # (Future) Dedicated React Dashboard SPA
├── docker/                # Services Dockerfile configurations
│   ├── backend/
│   └── frontend/
├── docs/                  # Detailed Architectural & Operational Docs
│   ├── ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── API_DOCUMENTATION.md
│   ├── DEPLOYMENT.md
│   ├── INSTALLATION.md
│   ├── ROADMAP.md
│   ├── ADMIN_GUIDE.md
│   ├── DEVELOPER_GUIDE.md
│   ├── IMPLEMENTATION_LOG.md
│   └── TASKS.md
├── docker-compose.yml     # Multi-container orchestra
├── Makefile               # Shortcuts for docker compose commands
├── .gitignore             # Root git ignore
└── README.md              # Root entry guide
```

---

## 🛠️ Technology Stack

### 🚀 Frontend (Marketing Website)
* **Framework**: Next.js 16 (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS v4
* **Animations**: Framer Motion
* **Iconography**: Lucide React
* **Components**: React Hook Form, Zod

### ⚡ Backend (Business Engine)
* **Framework**: Laravel 13
* **Language**: PHP 8.4+
* **Authentication**: Laravel Sanctum (Token-based)
* **Database**: PostgreSQL (with UUID primary keys & Soft Deletes)
* **Cache & Queues**: Redis
* **Design Patterns**: Repository Pattern, Service Layer, API Resources

---

## 📦 Docker Container Services

We manage local development using Docker Compose. The services spun up include:

1. **`novaryn-frontend`** (`frontend/`): React/Next.js Dev Server mapped to host port `3000`.
2. **`novaryn-backend`** (`backend/`): Laravel PHP-FPM API server exposed on host port `8000`.
3. **`novaryn-db`**: PostgreSQL 15 database instance exposed on host port `5432`.
4. **`novaryn-redis`**: Redis instance running caching and mail/lead queue workers on port `6379`.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure you have the following installed locally:
* **Docker** (version 20.10+ / 29.5+)
* **Docker Compose** (version v2+ / v5+)
* **Make** tool (utility shortcut runner)

### 2. Start the Environment
Run this in your terminal to build and boot the multi-container networks:
```bash
make up
```

### 3. Database Initialization
Once the containers are running, execute migrations and seed sample records:
```bash
make migrate
make seed
```
This will automatically create tables with UUID keys and seed **default admin credentials**:
* **Super Admin Account**: `admin@novaryn.tech`
* **Default Password**: `password123`

---

## 📖 Operational Documentation

Detailed system configurations, API schemas, and deployment checklists can be found in the `/docs` folder:

* **[Architecture Specifications](file:///home/eisen/projects/random-proj/novaryn/docs/ARCHITECTURE.md)**: Class mapping, repository flow diagrams.
* **[Database Schema Design](file:///home/eisen/projects/random-proj/novaryn/docs/DATABASE_SCHEMA.md)**: Tables relationships, constraints, UUID indices.
* **[API Endpoint Specifications](file:///home/eisen/projects/random-proj/novaryn/docs/API_DOCUMENTATION.md)**: Versioned `/api/v1` routes and payloads.
* **[Setup & Installation Guide](file:///home/eisen/projects/random-proj/novaryn/docs/INSTALLATION.md)**: Detailed step-by-step developer start instructions.
* **[Deployment Standard Procedures](file:///home/eisen/projects/random-proj/novaryn/docs/DEPLOYMENT.md)**: Docker containerizations and hosting guides.
* **[Developer Operations Manual](file:///home/eisen/projects/random-proj/novaryn/docs/DEVELOPER_GUIDE.md)**: Coding standards, git conventions.
* **[Internal Admin Dashboard Guide](file:///home/eisen/projects/random-proj/novaryn/docs/ADMIN_GUIDE.md)**: Lead flow status guidelines, CMS editor instructions.
* **[Implementation Log](file:///home/eisen/projects/random-proj/novaryn/docs/IMPLEMENTATION_LOG.md)**: Development trajectory track.
* **[Tasks Tracker](file:///home/eisen/projects/random-proj/novaryn/docs/TASKS.md)**: Lead pipelines, blog queues.
* **[System Roadmap](file:///home/eisen/projects/random-proj/novaryn/docs/ROADMAP.md)**: Quotations builder, invoicing, contract builder.
