# Setup & Installation Guide

Follow these steps to run the complete Novaryn platform locally.

---

## 🛠️ Prerequisites

Ensure you have the following installed on your machine:
* **Docker Engine** (version 20.10+) or Docker Desktop
* **Docker Compose** (version v2.0+)
* **Make** command utility (usually pre-installed on Linux/macOS)

---

## ⚙️ Environment Configuration

Before launching the Docker network, ensure both the frontend and backend environment parameters are set:

### 1. Backend Environment Setup
Create a `.env` file inside the `backend/` directory:
```bash
cp backend/.env.example backend/.env
```
Inside `backend/.env`, configure the database credentials to target the PostgreSQL container:
```env
APP_NAME=Novaryn
APP_ENV=local
APP_KEY=base64:auto_generated_by_seed_or_command
APP_DEBUG=true
APP_TIMEZONE=UTC
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=novaryn_db
DB_USERNAME=novaryn_user
DB_PASSWORD=novaryn_pass

CACHE_STORE=redis
REDIS_HOST=redis
REDIS_PORT=6379
```

### 2. Frontend Environment Setup
Create a `.env.local` file inside the `frontend/` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## 🚀 Running the Services

All container bindings and commands are controlled via the root [Makefile](file:///home/eisen/projects/random-proj/novaryn/Makefile).

### 1. Spin up the Container Cluster
Build and start the Next.js, Laravel, Postgres, and Redis containers:
```bash
make up
```

### 2. Initialize Database & Seeders
Run migrations to structure the PostgreSQL tables, then seed them with default admin credentials, settings, and mock leads:
```bash
make migrate
make seed
```

### 3. Verify System Operations
Once migrations complete successfully, access the following URLs in your browser:
* **Public Frontend Website**: [http://localhost:3000](http://localhost:3000)
* **Backend API Health Check**: [http://localhost:8000/up](http://localhost:8000/up)
* **Backend API Endpoint**: [http://localhost:8000/api/v1/pricing](http://localhost:8000/api/v1/pricing)

---

## 🛑 Troublestooting & Permissions

If you experience file write issues inside the `backend/` folder on Linux, fix the ownership back to your host user:
```bash
docker run --rm -v "$(pwd)":/app alpine chown -R 1000:1000 /app
```
