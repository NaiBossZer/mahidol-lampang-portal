# Phase 5 — Responsive / Accessibility

Date: 2026-09-10  
Repository: `NaiBossZer/mahidol-lampang-portal`  
Branch: `phase-5-responsive-a11y`

## Objective

Harden the shared responsive and accessibility foundation at page/runtime level without changing content, route paths, API contracts, authentication/authorization behavior, database behavior, or domain business logic.

## Completed in this pass

- strengthened global focus-visible behavior and keyboard target handling
- added scroll offset for keyboard/anchor navigation under sticky UI
- inherited form control typography to prevent mobile browser sizing drift
- added forced-colors accessibility fallback
- hardened embedded system navigation for narrow screens
- changed embedded system viewport sizing from fixed `100vh` to dynamic viewport sizing (`100dvh`)
- ensured embedded-system navigation controls maintain touch-friendly targets
- added explicit live/alert semantics for loading and connection failure states
- integrated Site Map into the shared `PublicAppShell`, including skip navigation and global public navigation/footer
- guarded Site Map content against narrow-screen overflow
- hardened the public header breakpoint strategy: full desktop navigation now starts at `xl` instead of `lg`, preventing navigation/control crowding at 1024px
- reduced the three existing logo widths only at sub-400px viewports to prevent horizontal overflow while preserving all three logos and the locked agency identity
- added `Escape` handling for the Centers menu and explicit `aria-controls` relationships
- removed the menu `onBlur` auto-close behavior so keyboard focus can move from the trigger into menu items reliably
- ensured desktop center menu items retain a minimum touch target

## Responsive QA matrix

Target widths:

- 360px — pending browser verification
- 390px — pending browser verification
- 768px — pending browser verification
- 1024px — pending browser verification
- 1280px — pending browser verification
- 1440px — pending browser verification

## Accessibility QA matrix

- keyboard-only navigation — implementation hardened; browser verification pending
- visible focus — implemented; browser verification pending
- skip navigation — implemented in shared shell
- semantic landmarks — implemented in shared shell/site map
- loading announcements — implemented
- error announcements — implemented
- touch targets — shared Button/Input baseline implemented; page-level verification pending
- reduced motion — implemented
- forced colors — implemented
- contrast — browser verification pending
- Escape behavior for the desktop Centers menu — implemented; browser verification pending

## Known remaining work

Several public pages still contain page-local legacy headers/layouts. They must be migrated and verified page-by-page rather than mass-replaced so that content and route behavior remain frozen. This is a prerequisite for a complete visual-production sign-off.

Phase 5 is therefore **in progress**, not signed off.
