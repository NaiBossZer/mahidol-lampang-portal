# Phase 9.1 — Vercel Runtime + API Routing Audit

**Repository:** `NaiBossZer/mahidol-lampang-portal`  
**Branch:** `main`  
**Scope:** Vercel deployment configuration, SPA fallback, Vercel Functions discovery, API routing, runtime verification readiness.

## Executive result

**Result: PASS with runtime verification pending.**

The repository uses a Vite SPA with server-side Vercel Functions under `/api`. The current `vercel.json` uses the standard SPA fallback rewrite to `/index.html`. Vercel's current configuration documentation states that filesystem precedence is applied before rewrites, so the catch-all SPA rewrite does not by itself imply that `/api/*` function files are swallowed by `index.html`. The repository contains the expected `api/` function tree, including health, public API, auth, admin, orders, products, inventory, and upload routes.

The current GitHub status for the reviewed deployment remains blocked by a Vercel **build-rate-limit / plan** status. Therefore this audit cannot claim a successful production runtime request until a deployment is actually available.

## Findings

### 1. Vercel SPA routing

`vercel.json` contains:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This is the documented SPA fallback pattern for Vercel. The configuration was updated only to add the official schema declaration; routing semantics were intentionally not changed in this phase.

### 2. API routing

The repository has a real `/api` function directory and includes:

- `api/health.ts`
- `api/activities.ts`
- `api/activity.ts`
- `api/centers.ts`
- `api/projects.ts`
- `api/inventory.ts`
- `api/products.ts`
- `api/orders.ts`
- `api/auth/*`
- `api/admin/*`
- `api/uploads/*`

The API handlers use Node request/response objects and return JSON through the shared `api/_http.ts` helper.

### 3. Runtime health endpoint

`GET /api/health` is suitable as the first production routing probe. It performs a real database query (`select now()`) and returns HTTP 200 when the database is connected or HTTP 503 when it is unavailable.

This makes it useful for distinguishing:

1. Vercel routing/function discovery failure;
2. Function runtime failure;
3. Supabase/database environment failure.

### 4. Deployment blocker

The latest reviewed commit status reports a failed `Vercel` check whose target indicates `upgradeToPro=build-rate-limit`. This is an infrastructure/plan/build-rate-limit blocker, not evidence of a TypeScript or Vite compilation error.

No GitHub Actions workflow run is associated with the reviewed commit, so GitHub does not currently provide independent build/lint evidence.

## Production verification checklist

After Vercel accepts a deployment, verify in this order:

```text
1. GET /                         -> 200 HTML containing the SPA shell
2. GET /activities               -> 200 SPA route, not 404
3. GET /api/health               -> 200 JSON when DATABASE_URL is valid
4. GET /api/activities           -> 200 JSON with published activities
5. GET /api/auth/me              -> 401/unauthenticated response without admin cookie
6. POST /api/auth/login          -> authenticated session cookie
7. GET /api/auth/me              -> authenticated response after login
8. GET /admin                    -> SPA route + AdminGuard behavior
9. GET /api/admin/*              -> authorization enforced server-side
```

## Security checks

- No secrets were added to the repository.
- `ADMIN_PASSWORD` and `DATABASE_URL` remain deployment-secret concerns.
- Admin authentication remains server-side.
- API responses use `Cache-Control: no-store` through the shared HTTP helper.
- Runtime verification must still confirm secure cookie behavior on the deployed HTTPS domain.

## Changes made in Phase 9.1

1. Added Vercel schema declaration to `vercel.json` without changing the SPA rewrite behavior.
2. Extended `scripts/smoke-test.mjs` with static Vercel/API routing guardrails:
   - Vercel schema
   - SPA fallback
   - API directory
   - health function
   - activities function
   - auth directory
   - admin directory
3. Added this audit document.

## Limitations

This phase cannot perform a live HTTP request against the production deployment through the GitHub connector. The Vercel build-rate-limit failure also prevents treating the current production deployment as a valid runtime test target.

**Phase 9.1 status: CODE AUDIT PASS / LIVE RUNTIME VERIFICATION BLOCKED BY VERCEL DEPLOYMENT AVAILABILITY.**
