# Developer Operations Manual

Welcome to the Novaryn development guide. This document outlines standard practices, coding conventions, and workflow rules.

---

## 💻 Code Style & Standards

### 1. PHP/Laravel Style Guide (PSR-12)
* **Naming**: Use camelCase for class methods and variables, StudlyCaps for class names.
* **Architecture**: Avoid bloated controllers. Put logic in **Services**, data queries in **Repositories**, validation in **Form Requests**, and formatting in **API Resources**.
* **Strict Types**: Add `declare(strict_types=1);` to all core classes.
* **Pint**: Run Laravel Pint before committing to auto-format syntax errors:
  ```bash
  docker compose exec backend ./vendor/bin/pint
  ```

### 2. TypeScript/React Style Guide (Next.js)
* **Naming**: PascalCase for React components, camelCase for variables/state hooks.
* **Component Structures**: Separate layout styling logic from data fetching. Keep custom hooks in `/hooks` and atomic cards in `/components`.
* **Tailwind**: Follow v4 utility alignments. Maintain clear flex grids and avoid hardcoded layouts that break responsiveness.

---

## 🛠️ Git Workflow Conventions

We follow a structured Git branching layout:

* **`main`**: Production release branch. Only stable, fully tested codes are merged.
* **`develop`**: Central integration branch. All feature development branches merge here.
* **`feature/name-description`**: Feature sandbox branches. Create branch from `develop`.

### Commit Message Naming Structure:
Follow conventional commits syntax:
* `feat(leads): add status transition and assignment controller`
* `fix(auth): correct sanctum token expiry configuration`
* `docs(api): update v1 endpoint response formats`
* `chore(deps): update composer package versions`

---

## 🧪 Testing Guidelines

We utilize Laravel Pest/PHPUnit for backend testing and Vitest/Jest for frontend validations.

### 1. Backend Testing
Run tests inside the PHP container:
```bash
docker compose exec backend php artisan test
```
* **Feature Tests**: Write tests for controller endpoints checking status transitions, payload formats, and Sanctum tokens validation.
* **Unit Tests**: Test math aggregates in analytics services.

### 2. Frontend linting
Run lint checks inside the Node container:
```bash
docker compose exec frontend npm run lint
```
Ensure all TypeScript definitions are strictly checked before pushing commits.
