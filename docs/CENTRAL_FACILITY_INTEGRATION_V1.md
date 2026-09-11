# Central Facility Integration v1

## Decision

`NaiBossZer/Facility-Safety` remains the canonical owner of Facility & Safety operational data. The Mahidol Lampang Portal is the central administrative entry point.

The shared Supabase project is the integration boundary. Facility data is not copied into Portal CMS tables.

## Central access flow

```text
Mahidol Lampang Portal Login
        |
   Supabase Auth
        |
 central_role / app_metadata.role
        |
   Permission Resolver
        |
 facility.read / activities.* / etc.
        |
 Central Admin
        |
 Facility & Safety
        |
 buildings / inspections / work_orders / assets / audit_logs
```

## Roles

- `SUPER_ADMIN`: all central permissions and Facility administration.
- `CONTENT_ADMIN`: portal/CMS/content permissions; no Facility administration by default.
- `OPERATIONS_ADMIN`: operational/activity permissions; Facility administration is not implied.
- `FACILITY_ADMIN`: Facility & Safety permissions.

Facility's existing operational roles (`staff`, `inspector`, `section_head`, `finance_head`, `deputy_dean`, `dean`, `admin`) remain valid for the Facility domain. `staff_profiles.central_role` is the bridge to the central Admin RBAC model.

## Canonical Facility tables

`categories`, `items`, `buildings`, `vendors`, `budget`, `personnel`, `work_orders`, `inspections`, `assets`, `fuel_vehicles`, `fuel_mower_inventory`, `fuel_trips`, `fuel_refuel_logs`, `fuel_plans`, `audit_logs`, `notification_jobs`, and `staff_profiles` remain Facility domain data.

## Security

- Supabase Auth is the identity source.
- Central role is represented in `staff_profiles.central_role` and synchronized to `auth.users.raw_app_meta_data.role`.
- Facility RLS continues to enforce database authorization.
- Portal API authorization remains separate from UI menu visibility.
- No service-role key is exposed to browser clients.

## Migration evidence

The central Supabase project currently contains the Facility domain tables and one active `staff_profiles` record. The existing Facility admin profile has been bridged to `SUPER_ADMIN` and its Auth metadata is synchronized.

This document describes the integration contract; production completion still requires portal build/deploy verification and authenticated end-to-end inspection smoke tests.
