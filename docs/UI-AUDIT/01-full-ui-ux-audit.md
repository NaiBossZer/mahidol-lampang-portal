# Phase 1 — Full UI/UX Audit จาก Source Code

## Audit scope

ตรวจจาก source code ของ `NaiBossZer/mahidol-lampang-portal` บน `main` โดยเน้น React routes, page composition, shared components, Tailwind/CSS tokens, forms, interactive states, accessibility hooks, image usage, error/loading states และความสอดคล้องกับ `DESIGN-SYSTEM.md`.

Baseline: `9bd8289fb2e3ad63414651840a75a2956bda323d`

**หลักการ:** รอบนี้เป็น audit เท่านั้น ไม่เปลี่ยน visual behavior ของ production โดยพลการ และไม่ตีความว่า source code ที่มีอยู่เท่ากับผ่าน visual QA บน browser ทุก breakpoint

---

## Executive conclusion

สถานะ UI/UX ปัจจุบันคือ **Functional but visually fragmented**.

โครงสร้าง routing และ component primitives มีฐานที่ดี แต่ presentation layer ยังมีหลาย visual language ปะปนกัน และหลายหน้าสร้าง layout/header/card/form ของตัวเองแทนการใช้ shared patterns เดียวกัน

### Critical findings

| ID | Severity | Finding | Impact |
|---|---|---|---|
| UI-01 | P0 | Global visual system ขัดกัน | ผู้ใช้รับรู้เว็บเหมือนหลายระบบที่ถูกรวมเข้าด้วยกัน |
| UI-02 | P0 | ยังไม่มี Global Public App Shell ที่ชัดเจน | Header/navigation/footer/spacing ไม่คงที่ข้ามหน้า |
| UI-03 | P0 | Design tokens มีอยู่ แต่ page code ยังใช้ hard-coded colors จำนวนมาก | เปลี่ยน theme/brand และรักษาความสม่ำเสมอยาก |
| UI-04 | P1 | Shared component extraction ยังไม่เสร็จ | ปุ่ม/card/header/state ต่างกันตามหน้า |
| UI-05 | P1 | Accessibility ถูกทำบางส่วน ไม่ได้เป็น contract ของทุก page | keyboard/form/status behavior ไม่รับประกันเท่ากัน |
| UI-06 | P1 | Responsive behavior ยังต้องตรวจจริงทุก route | layout ที่เขียนด้วย utility หลายชุดมีความเสี่ยงที่ mobile จะไม่เท่ากัน |
| UI-07 | P1 | Loading/error/empty states ไม่ได้ใช้ pattern เดียว | UX เมื่อ data/API ช้า/ล้มเหลวไม่สม่ำเสมอ |
| UI-08 | P2 | JSX บางส่วนถูกเขียนอัดแน่นมาก | อ่าน/maintain/refactor ยาก และเพิ่มโอกาส UI regression |

---

# 1. Architecture & information architecture

## 1.1 Route architecture

`src/App.tsx` มี public routes และ protected admin routes แยกกันชัดเจน และใช้ lazy loading สำหรับหน้าเกือบทั้งหมด ซึ่งเป็นฐานที่ดี

Public groups ที่ตรวจพบ:

- Home
- Activities / Activity Detail
- Centers
- Projects / Project Detail
- Shellac Learning Center
- Storefront / support-vegetables alias
- Smart Farm
- Clean Energy
- RAC
- Survey
- Site Map
- Login

Protected:

- Dashboard
- Admin
- LAC Satisfaction
- Facility Safety Admin

**UX issue:** route structure มีการแบ่ง domain ใน path แต่ visual navigation ยังไม่ได้ถูกทำให้สะท้อน information architecture เดียวกันทุกหน้า

### Recommendation
กำหนด public IA เป็น 5 กลุ่มหลัก:

1. **รู้จักศูนย์** — Home, Centers, Site Map
2. **เรียนรู้และกิจกรรม** — Activities, Shellac
3. **โครงการและผลลัพธ์** — Projects, Project Detail
4. **ระบบ/พื้นที่อัจฉริยะ** — Smart Farm, Clean Energy, RAC
5. **สินค้าและบริการ** — Storefront, Survey

Admin แยกเป็น application shell ของตัวเอง ไม่ควรใช้ navigation language เดียวกับ public site ทั้งหมด

---

# 2. Global shell / navigation audit

## Finding: P0

`App.tsx` route แต่ละหน้าไม่ได้ถูกห่อด้วย shared public `AppShell` และจาก source ที่ตรวจพบหลายหน้า render `<header>` ของตัวเอง เช่น Home, Activities, Centers, Projects, Activity Detail และ Shellac

ตัวอย่างที่ตรวจพบ:

- Home ใช้ sticky dark header
- Social pages ใช้ navy header แบบ page-specific
- Site Map และ admin pages ใช้ layout อีกชุด
- Storefront ใช้ header `#002D62`
- Login ใช้ centered card layout แยกออกไป

### UX consequence
- Brand/navigation position เปลี่ยนตาม route
- ผู้ใช้ไม่มี persistent mental model ว่าอยู่ส่วนไหนของเว็บไซต์
- การเพิ่มเมนูในอนาคตต้องแก้หลายไฟล์
- mobile navigation มีความเสี่ยงไม่เหมือนกัน

### Target
สร้าง:

`PublicAppShell`
- Header
- primary navigation
- mobile navigation
- breadcrumb/section context
- main container
- optional footer

และ:

`AdminAppShell`
- admin header/sidebar
- page title
- content area
- system status

---

# 3. Visual language audit

## Finding: P0

`DESIGN-SYSTEM.md` ระบุทิศทาง **Local Wisdom, Future Learning** และกำหนดพื้นหลังหลักเป็น `surface-warm #F8F6F0` พร้อม navy/blue/terracotta/gold/leaf

แต่ `src/styles.css` ตั้ง global `--background` เป็น dark navy OKLCH และ body ใช้ dark radial gradients

จึงเกิด visual-system conflict ระหว่าง:

### Intended system
- warm light surface
- local/community accent
- navy/blue structural color
- light content cards

### Current global CSS system
- dark navy data-wall background
- dark panels
- gold data-wall accents
- executive dashboard visual language

นี่เป็นสาเหตุหลักที่ทำให้หน้าเว็บดูเหมือนหลายผลิตภัณฑ์อยู่ในเว็บเดียวกัน

### Decision required in Phase 3
ไม่ควรแก้ด้วยการ search/replace สีทั้ง repo เพราะ admin/data-wall pages อาจต้องมี density และ contrast คนละระดับกับ public pages

ให้กำหนด 2 semantic themes:

- `public`: Local Wisdom, Future Learning
- `admin`: Executive/Data Operations

แต่ใช้ primitive เดียวกัน เช่น Button/Card/Input/Modal/Table/Status

---

# 4. Color/token audit

## Finding: P0/P1

มี token อยู่แล้วใน `styles.css` แต่ source pages ยังใช้ literal colors เช่น:

- `#123B63`
- `#1677A8`
- `#D6A84F`
- `#002D62`
- `#2E7D32`
- `#F2A900`
- Tailwind semantic/neutral colors หลายชุด

ตัวอย่าง source ที่พบ:

- Storefront ใช้ `#002D62`
- EmbeddedSystemView ใช้ `#002D62`
- RuntimeErrorBoundary ใช้ `#002D62`
- PlotDetailView ใช้ `#2E7D32`
- SmartPlotsWidget ใช้ `#2E7D32` และ `#F2A900`
- public social pages ใช้ `#123B63`, `#D6A84F`

### UX impact
Hard-coded values ทำให้:

- contrast tuning ยาก
- dark/light context เปลี่ยนยาก
- state color ไม่เป็น semantic system
- visual regression เกิดง่ายเมื่อแก้ brand color

### Target token layers

`primitive -> semantic -> component`

ตัวอย่าง:

`blue-700 -> action-primary -> Button.primary`

`green-700 -> status-success -> StatusBadge.success`

ไม่ควรให้ page เลือก hex เอง

---

# 5. Typography audit

`styles.css` กำหนด IBM Plex Sans Thai และ Chakra Petch แต่ source บางหน้าใช้ `font-['Prompt']` โดยตรง และบางหน้าพึ่ง Tailwind/system defaults

### Finding: P1
Typography จึงไม่ได้มี contract เดียวกันทั้งระบบ

### Recommendation
กำหนด:

- Body: IBM Plex Sans Thai / Noto Sans Thai / system-ui
- Display: Chakra Petch เฉพาะ display/number ที่ตั้งใจ
- ห้ามกำหนด font-family แบบ arbitrary ใน page ยกเว้น domain-specific documented exception

กำหนด type scale เช่น:

- body: 16/28
- small: 14/22
- h1: 36–48 responsive
- h2: 28–36
- h3: 20–24

---

# 6. Header / page-title patterns

พบการสร้าง header ซ้ำในหลาย page โดยใช้ class และ max-width ต่างกัน (`max-w-5xl`, `max-w-6xl`, `max-w-7xl`)

`ActivitiesPage` มี `PageHeader` แล้ว แต่ page อื่นไม่ได้ใช้ abstraction เดียวกันทั้งหมด

### Finding: P1
มี reusable pattern เริ่มต้นแล้ว แต่ยังไม่ถูกยกระดับเป็น global primitive

### Target components

- `SiteHeader`
- `PageHero`
- `PageHeader`
- `Breadcrumbs`
- `SectionHeader`
- `BackLink`

---

# 7. Cards / content blocks

Source ใช้ทั้ง Radix-style `Card` primitives และ raw `<div>` cards

ตัวอย่าง:

- Activities: rounded-3xl cards
- Centers: rounded-3xl cards
- Projects: raw card markup
- Storefront: shared Card primitive
- Admin: raw bordered/shadow cards

### Finding: P1
Card semantics, radius, shadow, padding และ hover behavior ไม่เป็นระบบเดียวกัน

### Target
กำหนด Card variants:

- default
- elevated
- interactive
- media
- metric
- admin

โดย domain page ไม่กำหนด shadow/radius เองโดยไม่มีเหตุผล

---

# 8. Buttons & interactive controls

มีทั้ง `<button>` raw, shared `Button`, RouterLink ที่ styled เป็น button และ anchor ที่ styled เป็น action

ข้อดี:
- หลายจุดมี `type="button"`
- บาง interaction มี aria attributes
- Radix/button primitives มีฐานพร้อมใช้

ข้อเสีย:
- visual states ไม่คงที่
- action hierarchy ต่างกันตาม page
- raw button บางหน้าไม่ผ่าน shared size/state contract

### Finding: P1
สร้าง Button API กลาง:

- primary
- secondary
- outline
- ghost
- destructive
- link

และ size:

- sm
- md
- lg
- icon

ทุกตัวต้องมี hover/focus/disabled/loading behavior

---

# 9. Accessibility audit

## Positive

- มี global `:focus-visible`
- มี `prefers-reduced-motion`
- `DESIGN-SYSTEM.md` กำหนด keyboard/form baseline
- Production EV calendar มี `aria-labelledby`, `role="tab"`, `aria-selected`
- Map3DViewer มี `role="alert"`
- รูป content หลายจุดมี meaningful `alt`
- Checkout QR มี alt text

## Gaps

### A11Y-01 — inconsistent semantic contract
การมี aria ในบาง component ไม่ได้หมายความว่าทุก interactive component ผ่าน baseline

### A11Y-02 — icon-only controls ต้องตรวจทีละจุด
โดยเฉพาะ cart, map, calendar และ admin controls

### A11Y-03 — status colors
มีสถานะที่สื่อด้วยสี เช่น green/yellow/red ซึ่งต้องมี text/icon/label เสมอ

### A11Y-04 — forms
Checkout/Survey/Login ต้องตรวจ label, error association, focus order และ keyboard submit อย่างเป็นระบบ

### A11Y-05 — dialogs/drawers
CartDrawer/CheckoutModal ต้องตรวจ focus trap, escape, restore focus และ mobile viewport

---

# 10. Image/media UX

Source มีการใช้ `alt` ที่ดีใน content images หลายจุด และ Home hero image มี `width/height` + `fetchPriority="high"`

พบทั้งภาพ local asset และ remote media/3D model architecture

### Findings
- Card image ratios ยังไม่ได้บังคับผ่าน component เดียวทุก domain
- บาง card ใช้ `h-48`, บาง card `h-52`, storefront ใช้ aspect ratio
- image loading strategy ไม่ได้เป็น global policy

### Target
`MediaCardImage` หรือ `ResponsiveMedia` กำหนด:

- aspect ratio
- object-fit
- loading
- decoding
- fallback
- alt contract

---

# 11. Loading / empty / error states

พบ:

- global route fallback: `กำลังโหลด...`
- RuntimeErrorBoundary
- Map3DViewer retry/error state
- EmbeddedSystemView retry/open-new-tab
- storefront empty cart state
- data pages ที่มี loading logic ของตัวเอง

### Finding: P1
มี state coverage แต่ไม่มี shared UX language

### Target states

`LoadingState`
`EmptyState`
`ErrorState`
`RetryState`
`SuccessState`
`Skeleton`

ใช้ icon, title, description, action pattern เดียวกัน

---

# 12. Forms / data-entry UX

ตรวจพบ forms ใน:

- Login
- Survey
- Checkout
- Admin LAC Satisfaction
- production/calendar interactions

### Risk
Form UX มี density และ styling ต่างกันมาก เพราะแต่ละ domain ใช้ markup/class ของตัวเอง

### Target
ใช้ field primitives:

- FormField
- Label
- Input
- Textarea
- Select
- Radio/SegmentedControl
- FieldError
- FieldHint

และกำหนด validation message placement เดียวกัน

---

# 13. Storefront UX

`PHASE-6-AUDIT.md` ระบุว่า storefront ถูกทำให้ปลอดภัยขึ้นและแยกจาก production/IoT/payment flow แล้ว

จาก UI source ยังพบ production-oriented components อยู่ใน repository แต่ถูกกำหนดให้เป็น future/Mark Work ไม่ควรทำให้ main storefront flow ผูกกับ IoT หรือ payment

### Current UX direction
Storefront ควรเป็น:

สินค้า → รายละเอียด → ตะกร้า → checkout placeholder/availability state

ไม่ควรทำให้ผู้ใช้ต้องเข้าใจ sensor/plot analytics เพื่อซื้อสินค้า

### Priority
P1: visual simplification + product hierarchy
P2: checkout/payment UX เมื่อ backend/payment พร้อม

---

# 14. Data visualization / Admin UX

Admin มีอีก visual language ซึ่งเหมาะกับ operational dashboard มากกว่า public content

พบ dashboard/admin cards, charts, satisfaction data และ facility safety data

### Recommendation
ไม่ควรบังคับ admin ให้ใช้ visual language เดียวกับ public content แบบ 1:1

ให้ใช้ shared primitives แต่เปลี่ยน density:

- smaller spacing
- stronger information hierarchy
- metric cards
- table/data states
- clear filters
- status chips

Admin ต้องเน้น task completion มากกว่าการเล่าเรื่อง

---

# 15. Responsive UX

Source มี responsive Tailwind utilities จำนวนมาก เช่น `sm:`, `md:`, `lg:` และ flex/grid adaptations

แต่ source audit ไม่สามารถยืนยัน visual correctness ของทุก breakpoint ได้โดยไม่ทำ browser visual QA

### Risk areas

1. navigation/header
2. large hero images
3. 3D map viewer
4. admin tables/data density
5. cart drawer
6. checkout modal
7. calendar tabs/forms
8. multi-column cards

### Required breakpoint QA

- 360px
- 390px
- 768px
- 1024px
- 1280px
- 1440px

---

# 16. Motion / interaction

Global reduced-motion support มีแล้ว

แต่ interaction styles มีหลายระดับ:

- hover shadow
- translate hover
- active scale
- transition-all
- backdrop blur

### Finding: P2
Motion ยังไม่ได้กำหนดเป็น motion tokens/patterns

### Recommendation
ใช้ 3 ระดับ:

- micro: 120–160ms
- standard: 180–240ms
- emphasis: 240–320ms

และหลีกเลี่ยง `transition-all` เมื่อไม่จำเป็น

---

# 17. Content UX / Thai language

Public pages ใช้ภาษาไทยเป็นหลัก ซึ่งตรงกับ design direction

พบ English labels เช่น `Mahidol Social Engagement Platform`, `SMART FARM` ซึ่งใช้ได้เมื่อเป็น supporting label

### Finding
ควรควบคุม terminology ให้เป็น glossary กลาง เพื่อไม่ให้หน้าเดียวกันใช้คำต่างกันสำหรับสิ่งเดียวกัน

ตัวอย่าง category labels ควรล็อกให้เป็นชุดเดียว เช่น:

- ศูนย์เรียนรู้
- กิจกรรม
- โครงการ
- ระบบอัจฉริยะ
- ผลผลิต/สินค้า
- แผนที่พื้นที่

---

# 18. Error boundary / recovery UX

`RuntimeErrorBoundary` มี recovery action กลับหน้าหลักและ reload ซึ่งเป็น baseline ที่ดี

### Improvement
แยก:

- user-facing error message
- technical detail สำหรับ admin/dev
- retry action เมื่อเป็น recoverable network/data error

ไม่ควรใช้ full-page crash UI สำหรับ error ที่ component-level recover ได้

---

# 19. Performance-related UX

Positive:

- route-level lazy loading
- Home eager-loaded
- image dimensions บางจุดกำหนดไว้
- 3D asset ถูกย้ายออกจาก Pages bundle ก่อนหน้านี้

### UX risk
Lazy route fallback เป็น text เดียว `กำลังโหลด...` ซึ่งอาจเกิด layout jump

### Target
ใช้ route skeleton ที่มี structure ใกล้กับ target page และกำหนด minimum content region

---

# 20. Component architecture scorecard

| Layer | Current | Target |
|---|---|---|
| Route architecture | 🟢 | 🟢 |
| Radix/UI primitives | 🟢 | 🟢 |
| Semantic design tokens | 🟡 | 🟢 |
| Public App Shell | 🔴 | 🟢 |
| Admin App Shell | 🟡 | 🟢 |
| Shared Header | 🟠 | 🟢 |
| Shared Card | 🟠 | 🟢 |
| Shared Button contract | 🟠 | 🟢 |
| Form primitives | 🟠 | 🟢 |
| State components | 🟠 | 🟢 |
| Accessibility contract | 🟠 | 🟢 |
| Responsive contract | 🟠 | 🟢 |
| Visual QA | 🔴 | 🟢 |

---

# 21. Page priority matrix

| Wave | Pages | Priority | Main UX work |
|---|---|---:|---|
| A | Home, Shellac, Site Map, Login | P0 | identity, shell, first impression |
| B | Activities, Activity Detail, Centers, Projects, Project Detail | P0 | content hierarchy, reusable cards/headers |
| C | Storefront, Smart Farm, Clean Energy, RAC, Survey | P1 | task flows, system presentation, forms |
| D | Dashboard, Admin, LAC Satisfaction, Facility Safety | P1 | admin shell, data density, filters/status |
| E | Error, loading, dialogs, sheets, calendar, map | P1 | cross-cutting consistency |

---

# 22. Recommended implementation order

## Phase 2 — IA

Freeze navigation taxonomy and public/admin shell boundaries.

## Phase 3 — Design System

Resolve public/admin theme conflict, semantic color tokens, typography, spacing, radius, shadows, motion and accessibility tokens.

## Phase 4 — Core Components

Build and migrate:

1. AppShell
2. Header
3. Footer
4. PageHero/PageHeader
5. SectionHeader
6. Button
7. Card
8. Badge/Status
9. FormField
10. Empty/Loading/Error states
11. Modal/Drawer patterns

## Phase 5 — Global Layout

Apply public shell first; admin shell separately.

## Phase 6 — Page redesign

Migrate by Wave A → E.

## Phase 7 — Responsive/A11y

Keyboard + screen reader semantics + breakpoint QA.

## Phase 8 — UX polish/performance

Motion, skeletons, image policy, route transitions, bundle review.

## Phase 9 — Visual regression

Capture reference screenshots and compare every route at required breakpoints.

---

# 23. What must NOT be done

1. ห้าม global search/replace สีทั้ง repo ก่อนแยก public/admin theme
2. ห้ามลบ production/storefront components เพียงเพราะยังไม่ได้ใช้
3. ห้ามเปลี่ยน route/API contract ใน UI audit phase
4. ห้ามแก้ business logic เพื่อให้หน้าตาสวยขึ้น
5. ห้าม claim accessibility pass จาก source scan อย่างเดียว
6. ห้าม claim responsive pass โดยไม่ทดสอบ browser ทุก breakpoint

---

# 24. Audit verdict

**Overall UI/UX readiness: 🟠 Needs structured redesign**

ไม่ใช่กรณีที่ต้องรื้อ React architecture ใหม่ทั้งหมด แต่ต้องจัดระเบียบ presentation architecture อย่างจริงจัง

**P0 ที่ต้องทำก่อน page-by-page redesign:**

1. Public/Admin shell boundary
2. Resolve global visual-system conflict
3. Semantic token contract
4. Shared component contract
5. Accessibility/state contract

เมื่อ 5 เรื่องนี้นิ่งแล้ว การ redesign หน้าเว็บจะไม่ย้อนกลับไปสร้างความแตกต่างแบบเดิมอีก
