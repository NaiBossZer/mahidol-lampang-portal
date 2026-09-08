# D3-E.2 — Supabase Consolidation

## Decision

`facility-safety-app` and `mahidol-lampang-portal` use the same Supabase project.
Supabase PostgreSQL is the central database / backup data layer for the unified
Mahidol facility + social-engagement platform.

The existing facility tables are preserved. The portal adds its own domain tables
for Social Engagement and Smart Farm vegetable support.

## Database ownership

Existing `facility-safety-app` domain remains authoritative for:
- categories, items, buildings, vendors, budget, personnel
- work_orders, inspections, user_preferences, system_meta
- assets, fuel_vehicles, fuel_mower_inventory, fuel_trips
- fuel_refuel_logs, fuel_plans, audit_logs, staff_profiles

Portal domain is additive:
- social_projects
- learning_centers
- activities
- activity_photos
- partners
- activity_partners
- activity_outcomes
- products
- orders
- order_items

Migration: `facility-safety-app/supabase/migrations/006_social_engagement_central.sql`

## Application connection

The portal keeps Drizzle as its data-access layer, but uses `postgres-js`
against the Supabase PostgreSQL connection string. The frontend never receives
the database credential.

Required server environment:

```env
DATABASE_URL=<Supabase PostgreSQL connection string>
ADMIN_PASSWORD=<portal admin password>
```

Do not put `DATABASE_URL` or a database password behind a `VITE_` variable.
The existing `VITE_SUPABASE_URL` / anon key in `facility-safety-app` are for the
browser Supabase client and are not a replacement for the server DB connection.

## Migration procedure

1. Open the existing Supabase project used by `facility-safety-app`.
2. Run `006_social_engagement_central.sql` in the Supabase SQL Editor.
3. Confirm the additive tables exist and existing facility tables remain intact.
4. Configure the portal server `DATABASE_URL` with the Supabase PostgreSQL URL.
5. Keep `ADMIN_PASSWORD` server-only.
6. Deploy the portal API and run the API smoke tests.

The migration is intentionally additive and uses `IF NOT EXISTS` for tables and
indexes. It does not drop, rename, or delete existing facility data.
