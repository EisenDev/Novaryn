# System Roadmap

This document outlines future development sprints, feature backlogs, and modular expansion plans for the Novaryn Platform.

---

## 📅 Phase 2: Billing & Proposal Automation (Q4 2026)

### 1. Quotation & Proposal Builder
* **Dynamic Builder**: Admin panel module allowing sales staff to select pre-configured system modules (e.g. Booking Engine, RFID gate, Player Wallet, POS) and budget lines.
* **Auto PDF Engine**: Generate a styled proposal PDF with scope of work, timeline estimates, and payment milestones.

### 2. Invoicing & GCash Tracker
* **Invoices Tracker**: Log payments due for setup and monthly services.
* **Payment Clearance Gates**: Integration with GCash and local bank APIs to check payment references and automatically approve credit/setup milestones.

---

## 📅 Phase 3: Client Portals & Project Monitoring (Q1 2027)

### 1. Client Milestone Tracker
* **Client Login Gate**: Secured login portal for clients to check build progress.
* **Figma & Sprint Boards Sync**: Direct integration to Jira/Github projects displaying milestone progress bars (e.g., discovery, staging, alpha release, production launch).

### 2. Digital Signatures (Contract Portal)
* **NDA & Contract Signing**: Send service agreements and SLAs. Allow digital signatures (DocuSign/custom Canvas drawing) saved directly inside PostgreSQL.

---

## 📅 Phase 4: Development Operations Roster (Q2 2027)

### 1. Developer Roster Dashboard
* **Staff Assignments**: Allocate developers, designers, and QA engineers to Won leads.
* **Time Tracker**: Log hours spent on specific custom modules to audit pricing accuracy.

### 2. Server Deployment Webhooks
* **Vercel/Docker Webhooks**: Trigger staging deployments, compile docker builds, and clear caches directly from the Novaryn admin dashboard.
