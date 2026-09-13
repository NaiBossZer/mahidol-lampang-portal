# Mahidol Lampang Central Admin Architecture v1

## 1. Objective

สร้าง Admin ขนาดใหญ่สำหรับศูนย์การเรียนรู้ โดยใช้ **Mahidol Lampang Portal เป็น Central Admin / Security Boundary** และให้แต่ละระบบยังเป็นเจ้าของข้อมูลปฏิบัติการของตนเอง

## 2. Systems reviewed

| Domain            | Repository / surface     | Admin responsibility                                      | Data owner                           |
| ----------------- | ------------------------ | --------------------------------------------------------- | ------------------------------------ |
| Portal / CMS      | `mahidol-lampang-portal` | users, activities, content, central navigation            | Portal DB                            |
| Lac Learning      | `mahidol-rac`            | activity context, satisfaction analytics, export          | shared activities + survey responses |
| Facility & Safety | `Facility-Safety`        | inspections, work orders, buildings, assets, safety audit | Facility DB domain                   |
| Smart Farm        | `mahidol-smart-farm`     | IoT/farm operations                                       | Smart Farm domain                    |
| Clean Energy / EV | `mahidol-clean-energy`   | energy/EV operations                                      | Clean Energy domain                  |
| Store / support   | Portal storefront        | products, orders, support workflows                       | Portal DB                            |

## 3. Target architecture

```text
                         MAHIDOL LAMPANG PORTAL
                                  |
                            /login + AdminGuard
                                  |
                       CENTRAL ADMIN CONTROL CENTER
                                  |
          +-----------------------+------------------------+
          |                       |                        |
       Content                  Learning               Operations
          |                       |                        |
   Activities/CMS        Lac Learning/Satisfaction   Facility & Safety
          |                       |                        |
          +-----------------------+------------------------+
                                  |
                         Central system registry
                                  |
                    +-------------+-------------+
                    |             |             |
               Facility DB   Portal DB     Domain systems
                    |
       buildings / inspections / work_orders
       assets / fuel / audit_logs / notifications
```

## 4. Identity and authorization

1. Portal Admin is the single entry point for administrator access.
2. No second Lac administrator password is permitted.
3. Browser clients must never receive a database service-role credential.
4. Portal server APIs may read/write domain data only after `isAdmin(req)` succeeds.
5. Facility-Safety remains protected by Supabase Auth + `staff_profiles` + RLS for operational users.
6. High-risk operations must be enforced again at the database/RLS layer; UI hiding is not a security control.

## 5. Facility/Safety database linkage

The Facility-Safety database already contains the operational entities required for the central dashboard:

- `buildings`
- `categories` / `items`
- `inspections`
- `work_orders`
- `assets`
- `fuel_vehicles`
- `fuel_mower_inventory`
- `fuel_trips`
- `fuel_refuel_logs`
- `fuel_plans`
- `audit_logs`
- `notification_jobs`
- `staff_profiles`

The new `system_registry` table is metadata only. It identifies participating systems without copying their operational rows into another database. This avoids dual-write and synchronization conflicts.

## 6. Canonical identifiers

- Learning/social activities: `public.activities.id` (UUID).
- Facility entities: their existing Facility-Safety primary keys remain canonical.
- Cross-system references should be explicit and immutable; do not match records by title/name.
- If a future entity must reference an activity, use `activity_id UUID` with a foreign key where both domains share the same database.

## 7. Security model

### Portal

- HttpOnly, Secure, SameSite admin session.
- Server-side authorization before sensitive API operations.
- No service-role key in client bundles.

### Facility-Safety

- Supabase Auth.
- `staff_profiles.active` + role-based `app_role()` / `is_manager()`.
- RLS on operational tables.
- Append-only audit trail for sensitive mutations.
- Work-order number reservation remains transaction-safe.

### Audit

Every important mutation should have an actor and record identity. Audit history must not be writable by ordinary clients.

## 8. Admin modules

### A. Executive Overview

- system health
- open work orders
- overdue inspections
- assets under repair
- satisfaction KPIs
- recent audit activity

### B. Facility & Safety

- buildings/locations
- inspection schedule and results
- corrective work orders
- assets and maintenance
- safety incidents (future domain)
- audit trail
- notification queue

### C. Learning Center

- activities
- Lac Learning Game
- surveys
- response analytics
- CSV export

### D. Smart Farm

- system status
- sensor/IoT health
- farm operations link

### E. Energy / EV

- clean energy status
- EV booking/operations link

### F. CMS / Social Engagement

- projects
- activities
- photos
- partners
- outcomes

### G. Governance

- role matrix
- audit logs
- data export
- system registry
- integration health

## 9. Security decisions

The legacy Facility-Safety migration contained several permissive authenticated write policies for operational/fuel tables. Migration `007_central_admin_security.sql` narrows these controls: managers retain full administrative writes; normal authenticated users create operational records but cannot rewrite/delete historical records; audit logs are read-only to managers and are no longer directly insertable by clients.

## 10. Deployment rule

This architecture is **implemented in source control but is not considered production-complete until**:

- Facility migration 007 is applied to the actual central Supabase project.
- Portal `npm run lint`, `npm run build`, and smoke checks pass.
- Facility `npm run lint`, `npm run build`, and authenticated RLS tests pass.
- Central Admin can read the Facility overview with an authenticated Portal admin session.
- Unauthorized requests return 401/403.
- No service-role secret is present in browser/network bundles.
