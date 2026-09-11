# Phase 7.3 — Admin CMS Implementation

## 7.3.1 — CMS foundation
- Canonical semantic CMS models are implemented for Services, Home Sections, Navigation and Footer.
- Existing Activities, Projects, Learning Centers and Partners remain canonical domain entities.

## 7.3.2 — Database registration
- CMS schema is registered in the existing Drizzle database layer.
- Migration `drizzle/0002_canonical_cms.sql` creates the semantic CMS tables and indexes.

## 7.3.3 — Services management
- Protected Services CRUD is available at `/api/admin/services`.
- Destructive delete now archives the service instead of physically deleting the row.
- Existing `publishedAt` is retained when an already-published service is edited.

## 7.3.4 — Home composition
- Protected Home Sections API is available at `/api/admin/home`.
- The six canonical Home section keys are controlled by the server.

## 7.3.5 — Navigation management
- Protected Navigation API is available at `/api/admin/navigation`.
- Hierarchical `parentId`, ordering and external/internal link metadata are supported.

## 7.3.6 — Footer management
- Protected Footer API is available at `/api/admin/footer`.
- Footer remains a content/settings model while presentation stays in the frontend.

## 7.3.7 — Existing content domains
- Protected endpoints are available for Projects, Learning Centers and Partners.
- No duplicate `cms_projects`, `cms_learning_centers` or `cms_partners` tables were introduced.

## 7.3.8 — Central CMS console
- `/admin/cms` now provides one Content CMS console with semantic tabs for all implemented content domains.
- CMS remains separated from Storefront, Facility & Safety, Smart Farm and Energy operations.

## 7.3.9 — Public CMS boundary
- `/api/cms/home` exposes only enabled Home Sections and published Services.
- The public endpoint contains no admin mutation capability.

## 7.3.10 — Hardening and verification boundary
- CMS tables enable PostgreSQL Row Level Security as a defense-in-depth database boundary.
- Canonical Home Sections and baseline Navigation records are seeded idempotently.
- Smoke tests verify CMS schema, migration, protected endpoints, public endpoint and admin route presence.

### Explicit remaining production boundary
Supabase Auth + application RBAC remains the target identity architecture. Phase 7.3 retains the existing server-side admin session while the authentication migration is completed as a separate controlled step. This phase does not expose service-role credentials to the browser and does not claim live database/build/deployment verification.
