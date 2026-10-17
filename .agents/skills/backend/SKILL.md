---
name: backend
description: Use when designing or building any backend/server code — APIs, database schema, auth, background jobs, infra choices. Evaluate the stack rather than defaulting to a managed BaaS.
---

# Backend

## Stack choice: evaluate, don't default

- Don't reach for Supabase/Firebase/managed-BaaS by default just because it's fast to bootstrap. Evaluate against the project's actual needs:
  - Need full control over schema, migrations, query performance, or complex business logic → **own backend** (below).
  - Genuinely a tiny prototype/internal tool with no real security or scaling needs, and speed matters more than control → managed BaaS is defensible. Say so explicitly and name the tradeoff (vendor lock-in, less control over auth/RLS behavior, cost at scale).
- **Default when unspecified**: local/self-hosted **PostgreSQL** + **Python (FastAPI)** backend. Reasons to deviate should be explicit (existing team stack, specific library needs, etc.), not just habit.

## Project structure (FastAPI)

- Structure by feature/domain per the `architecture` skill: `app/features/orders/{router.py, service.py, schemas.py, models.py}`.
- Routers stay thin: parse request → call service → return response. No DB queries or business logic in route handlers.
- Pydantic schemas separate from SQLAlchemy models — never return DB models directly from an endpoint (leaks internal fields).
- Config via a single typed settings module (`pydantic-settings`), reading from env vars. No hardcoded config scattered across files.

## Database

- Use migrations (Alembic) for every schema change — no manual/ad-hoc schema edits.
- Foreign keys and constraints enforced at the DB level, not just in application code.
- Index columns used in `WHERE`/`JOIN`/`ORDER BY` on tables expected to grow.
- Connection pooling configured explicitly; never open a raw unpooled connection per request.

## Security (priority, not an afterthought)

- **Auth**: hash passwords with `bcrypt`/`argon2` (never roll your own, never plain SHA). Short-lived access tokens + refresh token rotation for sessions. Store refresh tokens hashed.
- **Input validation**: every request body/query param validated via Pydantic schema at the edge — never trust client input, including data "already validated" on the frontend.
- **SQL**: parameterized queries / ORM only. Never string-format SQL with user input.
- **Authorization**: check permissions per-request at the service layer, not just "user is logged in" — verify the user owns/can access the specific resource being requested (fixes IDOR-class bugs).
- **Secrets**: never committed. Env vars or a secrets manager, not config files in the repo.
- **Rate limiting** on auth endpoints and any expensive/public endpoint.
- **CORS**: explicit allow-list of origins, never `*` with credentials enabled.
- **Errors**: return generic error messages to the client; log full detail server-side only. Don't leak stack traces, SQL errors, or internal paths to the client.
- **Dependencies**: pin versions, run vulnerability scans (`pip-audit`/`npm audit`) as part of the process, not skipped.
- **Least privilege**: DB user/service account for the app has only the permissions it needs, not superuser.

## Background jobs / async work

- Anything slow or unreliable (email, webhooks, heavy processing) goes to a queue (e.g. Celery/RQ with Redis, or a lightweight task queue), not run inline in the request-response cycle.
- Jobs are idempotent — safe to retry without double-processing.

## API design

- RESTful resource naming (`/orders/{id}`, not `/getOrder`), consistent pluralization.
- Version the API (`/v1/...`) from the start if it's public-facing or has external consumers.
- Consistent error response shape across all endpoints.

## Testing

- Unit test services/business logic in isolation (mock the DB layer).
- Integration tests against a real (test) Postgres instance for anything DB-dependent — don't over-mock the database layer to the point tests stop catching real query bugs.