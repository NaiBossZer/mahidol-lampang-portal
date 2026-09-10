# Phase 2–4 UI Implementation Record

Date: 2026-09-10
Repository: `NaiBossZer/mahidol-lampang-portal`

## Scope

Implementation follows the approved Figma direction while preserving existing content, data, routes, APIs, authentication behavior, and business logic.

## Phase 2 — Shared Components

Implemented/shared:

- Public application shell
- Public header/footer integration
- Shared page header pattern
- Shared section header pattern
- Loading / empty / error feedback states
- Card variants for Public/Admin usage
- Shared Button touch-target baseline
- Shared Input accessibility baseline
- Existing Radix primitives remain the behavioral foundation

## Phase 3 — Application Shell / Migration

Migrated the first public route wave to `PublicAppShell`:

- `/`
- `/activities`
- `/centers`

Admin routes now use `AdminAppShell`:

- `/dashboard`
- `/admin`
- `/admin/lac-satisfaction`
- `/admin/facility-safety`

The remaining legacy page-local public headers are intentionally not mass-replaced in this change because they require page-by-page removal to avoid duplicate navigation and accidental content/layout changes.

## Phase 4 — Responsive / Accessibility Foundation

Implemented:

- responsive content container rules
- minimum 44px shared button/input touch targets
- visible keyboard focus ring
- public/admin skip navigation
- mobile admin navigation
- mobile public navigation remains supported
- reduced-motion support
- high-contrast preference support
- horizontal overflow guard
- responsive media defaults
- semantic `main`, `nav`, `header`, `aside`, and status/alert roles in shared shells/states

## Frozen scope

Do not change in UI refactor:

- content wording/data
- route paths
- API contracts
- authentication/authorization behavior
- database behavior
- domain business logic

## QA note

GitHub Actions is the authoritative automated quality gate. Browser-level visual QA at 360/390/768/1024/1280/1440 still needs to be completed separately before claiming visual-production sign-off.
