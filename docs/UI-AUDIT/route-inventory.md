# Route Inventory — Phase 0

Source of truth: `src/App.tsx` at baseline commit `bc4b5d31d17786cfbfb1772fb54302133e848a97`.

| Route                     | Page                      | Access       | UI audit priority |
| ------------------------- | ------------------------- | ------------ | ----------------- |
| `/`                       | HomePage                  | Public       | P0                |
| `/activities`             | ActivitiesPage            | Public       | P1                |
| `/activities/:slug`       | ActivityDetailPage        | Public       | P1                |
| `/centers`                | CentersPage               | Public       | P1                |
| `/projects`               | ProjectsPage              | Public       | P1                |
| `/projects/:slug`         | ProjectDetailPage         | Public       | P1                |
| `/shellac`                | ShellacLearningCenterPage | Public       | P0                |
| `/storefront`             | StorefrontPage            | Public       | P1                |
| `/support-vegetables`     | StorefrontPage            | Public alias | P2                |
| `/smart-farm`             | SmartFarmPage             | Public       | P1                |
| `/clean-energy`           | CleanEnergyPage           | Public       | P1                |
| `/rac`                    | RACPage                   | Public       | P1                |
| `/survey`                 | SurveyPage                | Public       | P2                |
| `/site-map`               | SiteMapPage               | Public       | P0                |
| `/login`                  | LoginPage                 | Public       | P0                |
| `/dashboard`              | DashboardPage             | Protected    | P0                |
| `/admin`                  | AdminPage                 | Protected    | P0                |
| `/admin/lac-satisfaction` | LacSatisfactionPage       | Protected    | P1                |
| `/admin/facility-safety`  | FacilitySafetyAdminPage   | Protected    | P1                |
| `*`                       | NotFoundComponent         | Public       | P1                |

## Route observations

1. The application mixes public portal content, system views, storefront/production functions, survey flows, and administration in one router.
2. `/support-vegetables` is an alias to the same `StorefrontPage` component as `/storefront` and should be reviewed for information architecture clarity in Phase 2.
3. Protected routes are wrapped by `AdminGuard`; route protection should not be altered during UI redesign.
4. Most route components are lazy-loaded, while `HomePage` is eagerly imported.
5. Phase 1 should audit visual consistency by route family rather than redesigning routes independently.

## Suggested audit waves

### Wave A — Core identity

Home, Shellac, Site Map, Login.

### Wave B — Social/content

Activities, Activity Detail, Centers, Projects, Project Detail.

### Wave C — Systems/services

Storefront, Production/EV components, Smart Farm, Clean Energy, RAC, Survey.

### Wave D — Administration

Dashboard, Admin, LAC Satisfaction, Facility Safety.

### Wave E — Cross-cutting

404, loading states, error boundary, dialogs, sheets, forms, tables, calendars, maps.
