# Known UI Risks — Phase 0

These are baseline findings, not yet implementation fixes.

## P0 — Structural consistency risk

### Mixed visual systems

The repository contains multiple visual languages: the existing design-system document specifies a warm/light public identity, while `src/styles.css` currently defines a dark navy background and executive data-wall tokens. Several pages also use direct light/slate layouts. This needs reconciliation in Phase 1/2 before token changes are made.

### Page-local styling

Search results show repeated direct color literals such as `#123B63`, `#1677A8`, `#D6A84F`, `#002D62`, `#2E7D32`, and many page-local Tailwind combinations. This is a consistency and maintenance risk.

### Missing shared shell

`src/App.tsx` currently focuses on routing and does not show a single global `AppShell` wrapping the public pages. Page-level headers are therefore likely to diverge. This must be verified page-by-page in Phase 1.

## P1 — Component consistency

- Shared primitives exist, but the design-system document still marks shared Button/Card/Header extraction as incomplete.
- Storefront and production UI have domain-specific styling that should be mapped to shared primitives rather than independently redesigned.
- Loading, empty, error, and success states need a cross-route audit.

## P1 — Responsive risk

The codebase contains many responsive utility classes, but there is no evidence in the repository baseline of a route-by-route visual regression suite. Mobile/tablet behavior therefore needs explicit Phase 1 verification.

## P1 — Accessibility risk

The design-system document defines keyboard, focus, reduced-motion, form-label, and non-hover requirements. `src/styles.css` already includes a visible focus ring and reduced-motion handling, but implementation compliance must be audited across actual pages.

## P2 — Maintainability

- One-line JSX was recently found in `ProductionEvCalendar.tsx` and had already caused parser errors before formatting was restored.
- Very large page-local JSX blocks should be identified during Phase 1, but extraction should wait until semantic boundaries are understood.

## Important non-goals for Phase 0

- No visual redesign.
- No global color replacement.
- No dependency replacement.
- No route changes.
- No API/runtime migration.
- No production behavior changes.
