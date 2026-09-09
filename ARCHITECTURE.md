# Mahidol Social Engagement Platform — Code Architecture

## 1. Target architecture

The portal is a React/Vite SPA with a thin server API boundary. The codebase is organized by responsibility:

```text
src/
├── App.tsx                 # route composition only
├── pages/                  # route-level UI and page composition
├── components/             # reusable UI and feature components
├── services/               # browser data-access layer; no page-specific rendering
├── config/                 # static application configuration and system registry
├── data/                   # offline-safe fallback/domain seed data only
├── types/                  # shared TypeScript domain types
├── lib/                    # small framework-agnostic utilities
├── db/                     # server-only Drizzle schema/connection; never imported by browser UI
└── styles.css              # global design tokens/base styles

api/
├── _http.ts                # HTTP helpers
├── _auth.ts                # server authentication boundary
├── public endpoints        # read-only/public data APIs
└── admin/                  # protected write/management endpoints
```

## 2. Dependency direction

```text
Pages → Components → Services → /api/*
  │                         │
  ├→ Config                  └→ server API → DB
  └→ fallback Data

Pages/components must not access PostgreSQL, Drizzle, or Supabase credentials directly.
```

`src/services` is the intentional adapter boundary. This allows the frontend to keep its API contract while the backend is migrated toward the central Facility Safety API/Supabase architecture.

## 3. Static configuration

External subsystem URLs and the core-system registry live in `src/config` as the single source of truth. Do not hard-code the same external URL inside individual pages.

## 4. Data rules

- API data is the source of truth for published activities and managed content.
- `src/data` is limited to safe offline fallback content.
- Do not create a second database or duplicate the Facility Safety schema.
- Do not expose service-role keys or PostgreSQL credentials to the browser.
- Learning Experience remains part of the relevant core system; it is not a standalone LMS.

## 5. Performance rules

- Lazy-load heavy route modules.
- Keep the initial route lightweight.
- Use request deduplication/cache for safe GET requests.
- Invalidate cached resources after mutations.
- Use image dimensions, lazy loading, and async decoding for below-the-fold media.
- Avoid duplicated constants and duplicated API implementations.

## 6. Cleanup policy

Remove code only when it is demonstrably unused, duplicated, obsolete, or a diagnostic that should not be exposed as an application endpoint. Preserve routes, public behavior, existing database tables/data, and the Solar Game integration.

The Building Safety game is intentionally excluded.
