# Tasks Board

This board tracks active development tasks and operational objectives for the Novaryn Platform.

---

## 🟢 Completed Sprint (Phase 1: Foundation & CRM/CMS Setup)

* [x] **Workspace Setup**: Reorganize monorepo folders, write Docker Compose and Make configuration shortcuts.
* [x] **Users Table Migration**: Convert IDs to UUIDs, add roles field and soft deletes.
* [x] **Platform Database Schema**: Draft migrations for leads, pricing, projects, case studies, blogs, settings, messages, and audit logs.
* [x] **Database Seeding**: Generate admin test credentials, website configs, case study content, and demo leads.
* [x] **Eloquent Models**: Create and configure all database mapping files using HasUuids traits.
* [x] **Controller Endpoints**: Write versioned controllers handling CRM pipelines, audit list, public queries, and analytics metrics.
* [x] **CRM Form Modal**: Design a premium Framer Motion consultation modal.
* [x] **CTA Integration**: Connect all marketing/projects CTA buttons to launch the consultation popup.

---

## 🟡 Active Sprint (Phase 2: Local Container Deployment)

* [ ] **Build Docker Container Network**: Execute docker compose builds for local server networks.
* [ ] **Run Database Migrations & Seeders**: Boot table mappings and seed admin test users.
* [ ] **Verify Next.js Integrations**: Test leads form submissions directly inside the browser.

---

## 🔴 Future Sprint (Phase 3: Admin Dashboard SPA & Proposal Engine)

* [ ] **Admin SPA Setup**: Setup next.js template or React panel routes.
* [ ] **Lead Pipeline Board**: Drag-and-drop board mapping CRM status pipelines.
* [ ] **Quotation Builder**: Interactive pricing selector generating proposal PDFs.
* [ ] **Payment clearance integration**: Connect local payment gateways.
