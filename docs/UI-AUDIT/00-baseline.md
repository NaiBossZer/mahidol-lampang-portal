# Phase 0 — UI/UX Baseline

## Scope
Repository: `NaiBossZer/mahidol-lampang-portal`
Branch: `main`
Baseline commit: `bc4b5d31d17786cfbfb1772fb54302133e848a97`

Phase 0 is a non-invasive baseline. It documents the current UI architecture and known risks before any redesign or design-system refactor. No application code is changed by Phase 0.

## Current application shape

- React 19 + Vite 8 SPA.
- React Router is the application routing layer.
- Tailwind CSS 4 is integrated through `@tailwindcss/vite`.
- Radix UI primitives are used for several interaction components.
- `lucide-react` is the icon library.
- Recharts is available for data visualization.
- `@google/model-viewer` is used for the 3D map experience.
- The build command is `vite build` and the deployment target is Cloudflare Pages.
- Node-style API routes remain under `/api`; Phase 0 treats frontend and API runtime as separate concerns.

## Current route surface

Public routes currently declared in `src/App.tsx`:

- `/`
- `/activities`
- `/activities/:slug`
- `/centers`
- `/projects`
- `/projects/:slug`
- `/shellac`
- `/login`
- `/storefront`
- `/support-vegetables`
- `/smart-farm`
- `/clean-energy`
- `/rac`
- `/survey`
- `/site-map`

Protected routes:

- `/dashboard`
- `/admin`
- `/admin/lac-satisfaction`
- `/admin/facility-safety`

## Current UI architecture

Top-level shared components currently include:

- `AdminGuard`
- `EmbeddedSystemView`
- `Map3DViewer`
- `RuntimeErrorBoundary`
- `components/ui/*`
- `components/storefront/*`

The current UI is therefore a mix of shared primitives, page-local layouts, storefront-specific components, and direct Tailwind styling.

## Existing design-system direction

`DESIGN-SYSTEM.md` already defines a direction named **Local Wisdom, Future Learning**, with a Mahidol-oriented palette, Thai-first typography, minimum 44px interactive controls, 16–24px card radius, common image ratio, focus states, reduced-motion support, and a 1280px content container.

However, that document still lists shared Button/Card/Header extraction and component visual-state references as incomplete. Phase 0 therefore treats the design system as an existing specification that needs implementation audit, not as a blank slate.

## Baseline conclusion

The project is not starting from zero. The primary risk is **inconsistency between existing design intent and page/component implementation**. The next phase should inventory those inconsistencies before changing visual tokens or replacing components.
