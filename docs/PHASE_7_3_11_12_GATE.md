# Phase 7.3.11–7.3.12 Gate

## 7.3.11 — CMS → Public Content Integration

The public boundary is now explicitly represented by `GET /api/cms/home` and the frontend client `src/services/cmsApi.ts`.

Public responses are limited to:

- enabled Home Sections
- published Services

The existing Home activity feed remains on the established activity API and is not duplicated into CMS.

## 7.3.12 — E2E Verification Gate

Required before merging Phase 7.3:

1. install dependencies
2. run TypeScript/build validation
3. run CMS smoke tests
4. verify unauthorized Admin API access is rejected
5. verify published content is returned by the public CMS endpoint
6. verify draft/archived content is excluded from public responses
7. apply migration to the central Supabase database
8. verify RLS behavior in the live database
9. verify Vercel build/deployment status

### Current evidence boundary

Repository-side implementation is complete for the defined 7.3.11 public boundary. Live Supabase and Vercel verification are intentionally not marked complete without execution evidence.
