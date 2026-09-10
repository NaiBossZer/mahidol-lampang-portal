# Component Inventory — Phase 0

Baseline commit: `bc4b5d31d17786cfbfb1772fb54302133e848a97`.

## Shared application components

| Area | Current components | Phase 0 assessment |
|---|---|---|
| Runtime | `RuntimeErrorBoundary`, `AdminGuard` | Keep; audit visual fallback states |
| Embedded systems | `EmbeddedSystemView` | Candidate shared shell for external system views |
| Map | `Map3DViewer` | Specialized component; audit responsive/loading/error states |
| UI primitives | `components/ui/*` | Existing primitive layer; audit variants and token usage before replacing |
| Storefront | `components/storefront/*` | Domain component layer; audit against generic UI primitives |

## Existing primitive signals

The repository already uses Radix primitives and shared UI files for controls such as dialog, sheet, progress, radio group, calendar, and button-related patterns. This is a positive foundation for Phase 3/4.

## Current implementation risks

- Page code contains direct color literals and page-local Tailwind classes.
- Different page families visibly use different surface strategies (for example warm/light public pages, dark executive styles, and slate/white administrative layouts).
- Some components are heavily compressed into one-line JSX, increasing maintenance and syntax-regression risk.
- Storefront cards and production components contain their own visual rules instead of clearly documented shared variants.
- Existing design tokens are present in `src/styles.css`, but adoption across pages is not yet uniform.

## Refactor rule for later phases

Do not replace all primitives at once. First map existing usage to:

1. token
2. primitive
3. domain component
4. page pattern

Then consolidate only when two or more implementations have the same semantic responsibility.
