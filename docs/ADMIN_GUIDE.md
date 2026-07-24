# Internal Admin Dashboard Guide

This guide is designed for Novaryn staff to operate the CRM pipelines, edit website packages, review audit logs, and monitor conversion metrics.

---

## 🔒 Accessing the Platform

The administration console runs privately and requires Sanctum API token authentication.

* **Primary Login**: `/admin` (Front-end route)
* **Default Seeder Credentials**:
  * **Super Admin**: `admin@novaryn.tech` | **Password**: `password123`
  * **Sales Team**: `sales@novaryn.tech` | **Password**: `password123`
  * **Marketing Team**: `marketing@novaryn.tech` | **Password**: `password123`

---

## 💼 Lead Management & Status Flow

The CRM tracks leads from first submission through successful project launch. Every lead transitions through the following stages:

```text
 [New Submission] ──► [Contacted] ──► [Meeting Scheduled] ──► [Proposal Sent]
                                                                     │
                                    ┌────────────────────────────────┴┐
                                    ▼                                 ▼
                                 [ Won ]                           [ Lost ]
```

### Stage Definitions:
1. **New**: The consultation form has been submitted from the marketing site.
2. **Contacted**: Sales staff made contact via phone/email to gather more requirements.
3. **Meeting Scheduled**: Operational workshop dates are set to outline platform modules.
4. **Proposal Sent**: A custom conceptual proposal and pricing breakdown have been emailed.
5. **Negotiation**: Reviewing contracts, SLAs, or timeline adjustments.
6. **Won**: Contracts are signed, deposit paid, and features backlog created.
7. **Lost**: Target client went with another vendor or cancelled project.
8. **Archived**: SPAM or stale leads.

---

## 📝 Website CMS Management

Marketing users can edit elements on the live public marketing website from the backend:

### 1. Pricing Packages CMS
* **Recommendation Flag**: Checking "Recommended" displays the ★ MOST POPULAR green banner on the Professional package.
* **Sort Order**: Re-order cards by numeric value (1 = Left, 2 = Center, 3 = Right).
* **Setup/Monthly Fields**: Modify pricing values dynamically. Changes are immediately reflected on card flip.

### 2. Projects & Case Studies Showcase
* **Featured Flag**: Pin case studies (like PaddleYard) to the homepage highlight section.
* **Image Gallery**: Paste URLs of screenshots showing client login modals, check-in stacks, or admin analytics.

---

## 🛡️ Auditing & Monitoring

* **Audit Logs Page**: Every action (logins, package edits, lead status changes) is logged. The log displays:
  * User Name / Email
  * Action Name (e.g. `LEAD_STATUS_CHANGE`)
  * Old vs New parameters (helps recover overwritten data)
  * IP Address & browser details
* **Analytics Metrics**: Shows won leads revenue totals, industry distributions (Sports, clinics, etc.), and lead counts.
