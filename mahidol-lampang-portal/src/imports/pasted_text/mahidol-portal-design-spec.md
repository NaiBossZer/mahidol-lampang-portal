ROLE

You are a Senior Product Designer, UX Architect, Design System Lead,
and Accessibility Specialist.

Design a complete UI/UX system for:

"Mahidol Lampang Portal"

This is a public-facing digital portal for Mahidol University's
Lampang-area learning, community, research, environmental,
agricultural, technology, and facility-related initiatives.

The existing React application has already been audited from source code.
Do NOT simply redesign individual pages independently.

The primary goal is to establish ONE coherent visual language,
ONE public application shell, ONE admin application shell,
and ONE reusable design system.

==================================================
1. DESIGN DIRECTION
==================================================

Core design concept:

"Local Wisdom, Future Learning"

The visual identity should communicate:

- Mahidol University credibility
- Northern Thailand / Lampang local identity
- community engagement
- learning
- research
- sustainability
- agriculture
- environmental responsibility
- technology
- modern public institution

The design should feel:

- warm
- trustworthy
- intelligent
- modern
- calm
- educational
- locally rooted
- professional

Avoid:

- generic corporate SaaS appearance
- excessive futuristic UI
- excessive gradients
- excessive glassmorphism
- dark "dashboard everywhere" appearance
- excessive decorative elements
- emoji as primary UI
- inconsistent page-specific visual styles

The website should feel like ONE institution,
not a collection of unrelated microsites.

==================================================
2. CRITICAL ARCHITECTURE REQUIREMENT
==================================================

Design TWO application shells.

PUBLIC APPLICATION

PublicAppShell
├── Global Header
├── Primary Navigation
├── Mobile Navigation
├── Breadcrumb / Context Navigation
├── Main Content
└── Global Footer

ADMIN APPLICATION

AdminAppShell
├── Admin Sidebar / Navigation
├── Admin Header
├── Main Content
└── Operational Footer / Status Area

The Public and Admin experiences may have different information density,
but they MUST share the same underlying design language.

==================================================
3. BRAND COLOR SYSTEM
==================================================

Use these existing approved design-system tokens as the foundation.

Primary:

brand-navy
#123B63

brand-blue
#1677A8

Local accent:

local-terracotta
#C66B4F

northern-gold
#D6A84F

Environmental:

leaf
#5F8D62

Surfaces:

surface-warm
#F8F6F0

Text:

ink
#1F2933

muted-ink
#667085

Do NOT introduce unrelated primary colors.

Green may be used for environmental/agricultural content
and success states, but must NOT become the global brand color.

The previous implementation contains a conflicting dark navy /
"Executive Data Wall" visual system.

DO NOT reproduce that system as the default public website style.

The primary public experience should be light,
warm, spacious and content-oriented.

==================================================
4. DESIGN TOKENS
==================================================

Create Figma Variables / Styles for:

COLOR

brand/
  navy
  blue

accent/
  terracotta
  gold
  leaf

surface/
  warm
  white
  subtle

text/
  primary
  secondary
  muted
  inverse

state/
  success
  warning
  error
  info

SPACING

Use a consistent spacing scale.

Recommended base:

4
8
12
16
20
24
32
40
48
64
80
96

RADIUS

small
medium
large
extra-large

Recommended:

8
12
16
20
24

Do not randomly mix large radius values across pages.

SHADOW

Use subtle shadows only.

Avoid heavy floating-card effects.

==================================================
5. TYPOGRAPHY
==================================================

Primary body font:

IBM Plex Sans Thai

Fallback:

Noto Sans Thai
system-ui

Display / special numerical typography:

Chakra Petch

Use Chakra Petch selectively,
not for long Thai paragraphs.

Typography principles:

Body:
16px minimum

Body line-height:
1.6–1.8

Headings:
700–800

Create a complete type scale:

Display
H1
H2
H3
H4
Body Large
Body
Body Small
Caption
Label
Button

Thai text must remain highly readable on mobile.

==================================================
6. GLOBAL CONTAINER
==================================================

Maximum content width:

1280px

Use consistent horizontal padding.

Desktop:
32px+

Tablet:
24px

Mobile:
16px

Never allow content to touch the screen edge on mobile.

==================================================
7. PUBLIC HEADER
==================================================

Create ONE canonical Public Header.

Desktop:

- Mahidol / portal identity
- primary navigation
- clear active state
- optional CTA
- accessible focus state

Mobile:

- logo / identity
- hamburger menu
- accessible navigation drawer
- large touch targets

Minimum interactive target:

44px

Header must NOT be independently redesigned on each page.

==================================================
8. FOOTER
==================================================

Create one shared footer.

Include areas for:

- organization identity
- important navigation
- contact information
- social / external links if required
- copyright
- accessibility / policy links

Keep the footer structured rather than visually heavy.

==================================================
9. PAGE HEADER
==================================================

Create reusable PageHeader component.

Variants:

PageHeader / Standard
PageHeader / Hero
PageHeader / Detail
PageHeader / System

Each should support:

- breadcrumb
- eyebrow / category
- title
- description
- optional image
- optional action

Do not allow every page to invent its own header.

==================================================
10. BUTTON SYSTEM
==================================================

Create component:

Button

Variants:

Primary
Secondary
Outline
Ghost
Destructive
Link

Sizes:

Small
Medium
Large
Icon

States:

Default
Hover
Focus
Pressed
Disabled
Loading

Minimum height:

44px

Button text must describe an action clearly.

Avoid icon-only actions unless universally understandable
and accompanied by accessible labels.

==================================================
11. CARD SYSTEM
==================================================

Create reusable Card components.

Variants:

Card / Default
Card / Interactive
Card / Media
Card / Project
Card / Activity
Card / System
Card / Metric
Card / Status
Card / Admin

Standard image ratio:

16:10

Standard radius:

16–24px

Use subtle border and shadow.

Cards should not become excessively decorative.

==================================================
12. FORM SYSTEM
==================================================

Create:

FormField
Label
Input
Textarea
Select
Radio
Checkbox
FieldHint
FieldError
FieldSuccess

Every field must have:

- visible label
- focus state
- error state
- disabled state
- accessible association
- sufficient contrast

Create shared patterns for:

Login
Survey
Admin configuration
Checkout

Do NOT allow each page to invent its own form style.

==================================================
13. FEEDBACK SYSTEM
==================================================

Create:

LoadingState
Skeleton
EmptyState
ErrorState
RetryState
SuccessState
StatusBadge

Status must NEVER depend only on color.

Every status should have:

- color
- icon where useful
- text

Example:

Success
"ดำเนินการสำเร็จ"

Warning
"ต้องตรวจสอบ"

Error
"เกิดข้อผิดพลาด"

==================================================
14. CONTENT LISTING
==================================================

Create a reusable listing pattern.

For:

Activities
Centers
Projects
Products

Structure:

PageHeader
↓
Search / Filter (when applicable)
↓
Result summary
↓
Responsive Card Grid
↓
Pagination / Load More

Desktop:

3-column or 4-column depending on content.

Tablet:

2-column.

Mobile:

1-column.

==================================================
15. DETAIL PAGE
==================================================

Create reusable detail template.

For:

Activity Detail
Project Detail
Center Detail
System Detail

Structure:

Breadcrumb
↓
Category / metadata
↓
Title
↓
Supporting description
↓
Hero media
↓
Main content
↓
Related information
↓
Related content
↓
CTA

The template should support long-form Thai content.

==================================================
16. FLAGSHIP SHELLAC EXPERIENCE
==================================================

The Shellac Learning Center is a flagship experience.

It should feel special,
but MUST remain inside the global PublicAppShell.

Use:

- strong storytelling
- local identity
- learning journey
- visual hierarchy
- educational content
- interactive elements where useful

Do not turn it into a completely separate website.

==================================================
17. SYSTEM SHOWCASE
==================================================

Create shared System Detail patterns for:

Smart Farm
Clean Energy
RAC
other future systems

Structure:

System identity
↓
Purpose
↓
Key metrics / capabilities
↓
How it works
↓
Visual / diagram
↓
Current status
↓
Related learning / project content

System pages may use domain accents,
but must inherit the global design system.

==================================================
18. SITE MAP / 3D MAP
==================================================

The Site Map is an immersive experience.

Keep the 3D map visually dominant,
but surround it with the same global shell.

Provide:

- map introduction
- clear controls
- loading state
- error state
- retry
- legend
- location information
- mobile fallback

Do not make the map page visually unrelated to the rest of the portal.

==================================================
19. STOREFRONT
==================================================

The Storefront should use the same PublicAppShell.

Visual hierarchy:

Products
↓
Product information
↓
Standards / availability
↓
Cart

Do NOT mix:

- IoT sensor dashboards
- Smart Farm analytics
- production monitoring
- payment implementation

into the main storefront visual experience.

Those are separate future system domains.

==================================================
20. ADMIN DESIGN
==================================================

Create AdminAppShell.

Admin UX should prioritize:

- information density
- operational clarity
- task completion
- status
- tables
- filters
- charts
- forms
- actions

Admin may use denser spacing than Public UI.

Create:

AdminNavigation
AdminHeader
DashboardCard
MetricCard
DataTable
FilterBar
StatusBadge
AdminForm
ConfirmationDialog
EmptyState
ErrorState

Admin pages:

Dashboard
Admin Hub
LAC Satisfaction
Facility Safety

Do NOT make Admin look like a marketing website.

==================================================
21. ACCESSIBILITY
==================================================

Design for WCAG AA baseline.

Requirements:

- keyboard navigation
- visible focus ring
- sufficient contrast
- minimum 44px interactive targets
- semantic hierarchy
- form labels
- accessible dialogs
- accessible navigation
- no color-only state
- reduced motion
- readable Thai typography
- no hover-only information

Create component states showing:

Default
Hover
Focus
Disabled
Error
Loading
Success

==================================================
22. RESPONSIVE DESIGN
==================================================

Design all major components for:

360px
390px
768px
1024px
1280px
1440px

Mobile is NOT a reduced desktop design.

Navigation,
cards,
forms,
tables,
maps,
dialogs,
and admin layouts must have explicit responsive behavior.

==================================================
23. REQUIRED FIGMA STRUCTURE
==================================================

Organize the Figma file into pages:

01 — Foundations
02 — Design Tokens
03 — Typography
04 — Components
05 — Navigation
06 — Public Shell
07 — Admin Shell
08 — Public Page Templates
09 — Admin Page Templates
10 — Responsive
11 — Accessibility
12 — Page Designs

==================================================
24. COMPONENT LIBRARY
==================================================

Create reusable components with variants.

At minimum:

Header
MobileNavigation
Footer
Breadcrumb
PageHeader
Button
Card
Badge
StatusBadge
Input
Textarea
Select
Checkbox
Radio
Dialog
Drawer
Tabs
Pagination
Search
FilterBar
DataTable
MetricCard
LoadingState
Skeleton
EmptyState
ErrorState
Toast
FormField

All components must use Auto Layout.

Use component properties and variants
instead of duplicated components.

==================================================
25. FIRST SCREENS TO DESIGN
==================================================

Do NOT immediately design every page.

First establish the system with these screens:

1. Home
2. Activities Listing
3. Activity Detail
4. Shellac Learning Center
5. Site Map
6. Storefront
7. Smart Farm
8. Admin Dashboard
9. Admin LAC Satisfaction
10. Login

These screens are reference implementations
for the rest of the application.

==================================================
26. DESIGN QUALITY BAR
==================================================

The result must look like a mature university digital platform.

Prioritize:

clarity
consistency
accessibility
content hierarchy
trust
local identity
responsive behavior
maintainability

Do not optimize for visual novelty at the expense of usability.

The most important outcome is:

ONE WEBSITE
ONE VISUAL LANGUAGE
ONE DESIGN SYSTEM
TWO APPLICATION SHELLS
MANY REUSABLE PAGE PATTERNS

==================================================
27. IMPLEMENTATION AWARENESS
==================================================

The existing application is React + Vite + Tailwind
with Radix UI and Lucide icons.

Design components should be implementable in this architecture.

Prefer:

- reusable components
- token-driven styling
- predictable variants
- semantic HTML
- Lucide icons
- responsive Auto Layout

Avoid design decisions that require replacing the existing
React architecture.

The Figma design should become the source of truth
for the next implementation phase.