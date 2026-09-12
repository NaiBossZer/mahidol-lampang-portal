# Mahidol Social Engagement Platform — Code Architecture

## 1. Platform architecture

The portal is a React/Vite SPA with a thin server API boundary and a Central Admin workspace. The Master Feature Map is the product scope contract: `docs/MASTER-FEATURE-MAP.md`.

```text
src/
├── App.tsx                 # route composition only
├── pages/                  # route-level UI and page composition
├── components/             # reusable UI and feature components
│   ├── ai/                 # shared AI workspace primitives
│   └── layout/             # public/admin shells
├── services/               # browser data-access layer
├── config/                 # static configuration + admin feature registry
├── data/                   # offline-safe fallback/domain seed data only
├── types/                  # shared TypeScript domain types
├── lib/                    # small framework-agnostic utilities
├── db/                     # server-only Drizzle schema/connection
└── styles.css              # global design tokens/base styles

functions/api/
├── public/                 # public/read-only endpoints
└── admin/                  # authenticated management endpoints

Supabase
├── Auth                     # central identity
├── PostgreSQL               # central operational data
└── Storage                  # managed media objects
```

## 2. Dependency direction

```text
Pages → Components → Services → /api/* → Supabase
  │          │
  └──────────┴→ Config / safe fallback Data

AI UI → AI Manager → Tool Registry → Portal API → Supabase
```

Pages/components must not access PostgreSQL, Drizzle, service-role credentials, or Supabase management credentials directly.

## 3. Security boundaries

- Supabase Auth is the central identity boundary.
- `AdminGuard` protects admin routes.
- `app_metadata.role` is the RBAC source of truth.
- Roles remain exactly `SUPER_ADMIN`, `CONTENT_ADMIN`, `OPERATIONS_ADMIN`, `FACILITY_ADMIN`.
- Every server-side management action must enforce authentication and permission again; UI hiding is never authorization.
- AI does not bypass Auth, AdminGuard, RBAC, policy checks or Portal API.
- AI never executes SQL directly.
- Service-role credentials never reach the browser.

## 4. Domain architecture

```text
Activity
  ├── Occurrence (1:N)
  │     ├── Survey
  │     │     ├── Sections
  │     │     │     └── Questions
  │     │     └── Responses → Answers
  │     └── Organizers
  ├── Learning Centers (N:M)
  ├── Organizations
  └── Media references

Learning Center
  └── Content / Activity relationships

Organization
  └── Parent → Child hierarchy

Content / CMS
  └── Public presentation
```

Historical data must be preserved. The intended lifecycle is Active → Archived → Retired. Cancelled activity/occurrence records remain stored for audit/history but are hidden from normal views and excluded from KPI/satisfaction calculations.

## 5. Admin feature registry

`src/config/admin-features.ts` is the machine-readable registry corresponding to the Master Feature Map. It is the starting point for preventing drift between planned features, navigation and permissions. Route modules remain independently lazy-loaded.

## 6. AI architecture

```text
Admin Intent
  ↓
Context
  ↓
Auth + AdminGuard
  ↓
RBAC / Permission
  ↓
Policy + Risk
  ↓
AI Plan
  ↓
Approval when required
  ↓
Tool Registry
  ↓
Portal API
  ↓
Supabase / Storage
  ↓
Verification
  ↓
Result
  ↓
Audit Trail
```

Document ingestion uses only `FOUND` / `NOT FOUND` completeness states. No confidence score, guessing or fabricated fields.

AI Media is not a separate domain. Media operations are part of Activity/Occurrence workflows. AI Facility is deferred and must not modify `NaiBossZer/Facility-Safety` as part of this platform work.

## 7. Data and integration rules

- API data is the source of truth for published activities and managed content.
- Supabase is the central operational data source.
- `src/data` is only safe fallback/seed data.
- Do not create a second database or duplicate Facility Safety schemas.
- External subsystem URLs live in `src/config`.
- Keep public Portal behavior and existing Solar Game integration.

## 8. Performance rules

- Lazy-load heavy route modules.
- Deduplicate/cache safe GET requests.
- Invalidate cached resources after mutations.
- Use image dimensions, lazy loading and async decoding for media.
- Keep dashboard and admin navigation responsive.
- Avoid duplicated constants, API implementations and domain logic.

## 9. Implementation model

The platform is delivered as vertical slices across the Master Feature Map rather than isolated mock screens:

1. Architecture + Design System
2. Core Operations: Activity + Occurrence + Media
3. Survey + Question Builder + Responses + Analytics
4. Learning Center + CMS + Partners
5. Analytics + Reports + Search + Notifications
6. Governance: Admin Users + RBAC + Audit + Lifecycle + Settings
7. AI Manager + Tool Registry + Activity Agent + Survey Agent + Content Agent + Analytics Agent
8. Future Facility integration

Each slice must be production code with real API/data boundaries where implemented. Stitch `code.html` files are design references only; production UI remains React components.
