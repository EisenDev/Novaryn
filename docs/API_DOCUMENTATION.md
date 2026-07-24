# API Endpoint Specifications

All endpoints are versioned and prefixes are grouped under `/api/v1`. Payloads require `Content-Type: application/json` and `Accept: application/json` headers.

---

## 🌎 Public Endpoints (Next.js Integrations)

### 1. Retrieve Pricing Packages
* **Endpoint**: `GET /api/v1/pricing`
* **Response (200 OK)**:
```json
{
  "status": "success",
  "data": [
    {
      "id": "e0b49f48-a73b-4ca0-9eb4-86ebc03e2c38",
      "name": "Starter",
      "setup_price": "₱50,000 – ₱100,000",
      "monthly_price": "₱10,000",
      "description": "Perfect for small businesses starting their digital journey.",
      "features": ["Custom Website", "Booking System"],
      "recommended": false,
      "button_text": "Get Started",
      "sort_order": 1,
      "visible": true
    }
  ]
}
```

### 2. Retrieve Projects Showcase
* **Endpoint**: `GET /api/v1/projects`
* **Response (200 OK)**: Returns an array of projects with status `published` or `featured`.

### 3. Retrieve Project & Case Study Details
* **Endpoint**: `GET /api/v1/projects/{slug}`
* **Response (200 OK)**: Returns the matching project along with its `case_study` relationship.

### 4. Submit Lead Consultation Form
* **Endpoint**: `POST /api/v1/leads`
* **Payload Request**:
```json
{
  "name": "John Doe",
  "company": "Acme Inc",
  "email": "john@acme.com",
  "phone": "09171234567",
  "industry": "Sports Facilities",
  "budget": "₱150,000 – ₱200,000",
  "timeline": "1-2 months",
  "message": "We need a court reservation app."
}
```
* **Response (201 Created)**:
```json
{
  "status": "success",
  "message": "Consultation inquiry submitted successfully.",
  "lead_id": "c1f728cb-b097-4029-9e8c-851532f1f0e4"
}
```

### 5. Newsletter Subscription
* **Endpoint**: `POST /api/v1/newsletter`
* **Payload**: `{ "email": "user@domain.com" }`
* **Response (200 OK)**: `{ "status": "success", "message": "Subscribed..." }`

---

## 🔒 Administration Authentication

### 1. Account Login
* **Endpoint**: `POST /api/v1/auth/login`
* **Payload**:
```json
{
  "email": "admin@novaryn.tech",
  "password": "password123"
}
```
* **Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Logged in successfully.",
  "token": "1|sanctum_token_plain_text_hash_here",
  "user": {
    "id": "a9a3b6fc-dcd6-4e58-8686-215c9a4df54b",
    "name": "Super Admin",
    "email": "admin@novaryn.tech",
    "role": "super_admin"
  }
}
```

### 2. Verify Session (Me)
* **Endpoint**: `GET /api/v1/auth/me`
* **Headers**: `Authorization: Bearer <token>`
* **Response (200 OK)**: Returns the active administrative user info.

### 3. Log out Session
* **Endpoint**: `POST /api/v1/auth/logout`
* **Headers**: `Authorization: Bearer <token>`
* **Response (200 OK)**: `{ "status": "success", "message": "Logged out..." }`

---

## 🛡️ Protected Dashboard Resources (Requires Bearer Token)

### 1. Leads Management
* `GET /api/v1/leads`: Paginated lists. Accepts filter query parameters `?status=new`, `?industry=Restaurants`, and search inputs `?search=John`.
* `GET /api/v1/leads/{id}`: Single profile fetch.
* `PUT /api/v1/leads/{id}`: Update lead info.
* `PATCH /api/v1/leads/{lead}/status`: Modify progress (`status`).
* `PATCH /api/v1/leads/{lead}/assign`: Change assigned staff owner (`assigned_to`).
* `DELETE /api/v1/leads/{id}`: Archives lead (Soft Delete).

### 2. CMS Tables Management
* `apiResource` endpoints for `pricing` (Pricing Packages), `projects` (Projects & Case Studies), `testimonials` (Testimonials), and `blog` (Blog posts). Includes full CRUD controls (`GET`, `POST`, `PUT`, `DELETE`).

### 3. Settings Engine
* `GET /api/v1/system/settings`: Returns a key-value dictionary of all configurations.
* `POST /api/v1/system/settings`: Takes `{ "settings": { "key": "value", ... } }` and updates variables.

### 4. Audit Log
* `GET /api/v1/system/audit-logs`: Returns paginated audit items.

### 5. Analytics
* `GET /api/v1/dashboard/analytics`: Returns dashboard aggregates (today's counts, won ratios, industry splits).
