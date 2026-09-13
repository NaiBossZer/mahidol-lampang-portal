# Phase 1 — Page-by-Page UI/UX Audit Matrix

Source-based matrix from the current `main` branch.

| Route                     | Source                                 | UX role                  | Current pattern observed                           | Severity | Required direction                                       |
| ------------------------- | -------------------------------------- | ------------------------ | -------------------------------------------------- | -------- | -------------------------------------------------------- |
| `/`                       | `HomePage.tsx`                         | Landing / discovery      | Sticky dark header, warm page surface, hero image  | P0       | Become canonical PublicAppShell + strong IA entry points |
| `/activities`             | `social/ActivitiesPage.tsx`            | Content listing          | Own `PageHeader`, navy hero, 3xl cards             | P0       | Shared PageHeader/Card + filters/search pattern          |
| `/activities/:slug`       | `social/ActivityDetailPage.tsx`        | Content detail           | Own navy header + large media                      | P0       | Shared detail template + breadcrumb + related content    |
| `/centers`                | `social/CentersPage.tsx`               | Center discovery         | Own header + 3xl cards                             | P0       | Shared listing shell and card/media ratio                |
| `/projects`               | `social/ProjectsPage.tsx`              | Project listing          | Own header + local warm/navy styling               | P0       | Shared project listing pattern                           |
| `/projects/:slug`         | `social/ProjectsPage.tsx`              | Project detail           | Same source module, local detail markup            | P0       | Dedicated detail template/pattern                        |
| `/shellac`                | `social/ShellacLearningCenterPage.tsx` | Flagship learning center | Navy header, warm surface, banner image            | P0       | Treat as flagship public experience; shared shell        |
| `/site-map`               | `SiteMapPage.tsx`                      | Spatial discovery        | Slate page surface; 3D map                         | P0       | Shared shell + map-specific immersive layout             |
| `/login`                  | `admin/LoginPage.tsx`                  | Authentication           | Centered white card, green primary action          | P1       | Admin auth shell; consistent focus/error/loading states  |
| `/storefront`             | `store/StorefrontPage.tsx`             | Commerce/content         | `#002D62` header, slate surface                    | P1       | Public shell + focused product hierarchy                 |
| `/support-vegetables`     | `store/StorefrontPage.tsx`             | Alias                    | Same storefront                                    | P2       | Keep alias; canonicalize navigation to `/storefront`     |
| `/smart-farm`             | `systems/SmartFarmPage.tsx`            | System showcase          | Domain-specific system UI                          | P1       | System detail template + clear status/data hierarchy     |
| `/clean-energy`           | `systems/CleanEnergyPage.tsx`          | System showcase          | Domain-specific system UI                          | P1       | System detail template + metrics narrative               |
| `/rac`                    | `systems/RACPage.tsx`                  | System/showcase          | Domain-specific system UI                          | P1       | Shared system shell + content hierarchy                  |
| `/survey`                 | `SurveyPage.tsx`                       | Form / feedback          | Emerald-tinted surface, white card, local controls | P1       | Shared form field/state contract                         |
| `/dashboard`              | `admin/DashboardPage.tsx`              | Operations               | Dense white cards / charts                         | P1       | AdminAppShell + operational density                      |
| `/admin`                  | `admin/AdminPage.tsx`                  | Admin hub                | Slate surface, Prompt override, custom links       | P1       | Admin navigation + task-oriented dashboard               |
| `/admin/lac-satisfaction` | `admin/LacSatisfactionPage.tsx`        | Admin configuration/data | Dense controls/data                                | P1       | Admin shell + form/table/status primitives               |
| `/admin/facility-safety`  | `admin/FacilitySafetyAdminPage.tsx`    | Facility operations      | Navy banner + dense data                           | P1       | Admin shell + operational status model                   |
| `*`                       | `App.tsx` `NotFoundComponent`          | Recovery                 | Warm surface, hard-coded navy action               | P1       | Shared Error/NotFound template                           |

## Cross-page patterns

### Header duplication

Public content pages repeatedly create their own `<header>`. This is the highest-leverage refactor because it affects navigation, identity, responsive behavior and accessibility simultaneously.

### Card duplication

Social pages use raw card markup while Storefront uses UI `Card`. The visual contract must be centralized before page redesign.

### Form duplication

Login, Survey, Checkout and Admin configuration each have domain-local field styling. The field/error/focus/loading contract should be shared.

### State duplication

Loading/error/empty/retry patterns exist but are not consistently represented by one component vocabulary.

## Page-level acceptance criteria for Phase 6

Every migrated public page must have:

- PublicAppShell
- canonical page title + supporting description
- mobile navigation
- consistent container width
- shared button/card/status primitives
- loading/empty/error state where data is asynchronous
- keyboard-visible focus states
- semantic headings
- meaningful image alt text
- responsive behavior at 360/390/768/1024/1280/1440px

Every migrated admin page must additionally have:

- AdminAppShell
- clear current section/navigation state
- task-oriented page title
- data density appropriate for desktop
- mobile fallback for tables/charts
- explicit status text, not color-only indicators
