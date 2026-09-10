# Phase 5 — Responsive / Accessibility

Date: 2026-09-10  
Repository: `NaiBossZer/mahidol-lampang-portal`  
Branch: `phase-5-responsive-a11y`

## Objective

Harden the shared responsive and accessibility foundation at page/runtime level without changing content, route paths, API contracts, authentication/authorization behavior, database behavior, or domain business logic.

## Phase 5 sign-off

**Implementation scope: COMPLETE.** Phase 5 is closed for code-level responsive/accessibility hardening. Browser-based visual comparison and final pixel-level validation are intentionally carried into Phase 6 so that Phase 5 remains focused on responsive behavior, keyboard access, semantics, focus states, touch targets, and runtime resilience.

## Completed

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
- preserved the three existing logos and locked agency identity, with only sub-400px logo width reduction to prevent horizontal overflow
- added `Escape` handling for the Centers menu and explicit `aria-controls` relationships
- removed menu `onBlur` auto-close behavior so keyboard focus can move from the trigger into menu items reliably
- ensured desktop center menu items retain a minimum touch target
- removed the public navbar Search tool so the primary navigation remains focused on the approved information architecture

## Approved public navbar layout

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Logo 1][Logo 2][Logo 3]  งานพันธกิจเพื่อสังคม                         TH/EN  🛒  เข้าสู่ระบบ │
│                         คณะสิ่งแวดล้อมฯ ม.มหิดล · พื้นที่สบปราบ ลำปาง                     │
│                                                                                              │
│                  หน้าแรก   กิจกรรม   ศูนย์⌄   แผนที่   ร้านค้า                              │
└──────────────────────────────────────────────────────────────────────────────────────────────┘

Centers ▼
  • Shellac Learning Center
  • Smart Farm Station
  • Clean Energy Station
```

Search is intentionally absent from the public navbar. Projects remains a route but is not a navbar item. Login remains the separate right-side action.

## Responsive behavior

- 360px / 390px: compact three-logo identity + hamburger navigation
- 768px: mobile/tablet navigation remains touch-friendly
- 1024px: avoids crowded desktop navigation by keeping the full nav at `xl`
- 1280px / 1440px: full public navigation, Centers dropdown, language switcher, cart, and Login action

## Accessibility baseline

- keyboard-only navigation — hardened in shared public header/shell
- visible focus — implemented
- skip navigation — implemented in shared public shell
- semantic landmarks — implemented in shared public shell/site map
- loading announcements — implemented
- error announcements — implemented
- touch targets — shared Button/Input baseline and public header controls hardened
- reduced motion — implemented
- forced colors — implemented
- Escape behavior for the desktop Centers menu — implemented
- no search control remains in the public navbar

## Validation boundary

Automated repository quality checks remain the source-of-truth gate for build/lint/smoke status. Browser visual inspection is not claimed as completed here; that work belongs to Phase 6 Visual QA and must be evidenced separately.

## Phase status

**Phase 5: CLOSED — implementation complete.**  
**Next: Phase 6 — Visual QA against Figma, page-by-page.**
