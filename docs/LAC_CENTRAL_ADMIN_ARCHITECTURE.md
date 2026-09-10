# Lac Learning Game — Central Admin Architecture

## Decision

The **Mahidol Lampang Portal** is the single administrative entry point for the Lac Learning Game satisfaction system.

Admin authentication happens at the Portal first. The Portal's existing protected admin session (`/api/auth/me`) is the authorization boundary for Lac administration. The Lac game remains the public learning/game application and public survey surface.

## Responsibilities

### Portal Admin
- authenticate administrator
- create/edit/publish activity records
- control satisfaction survey availability per activity
- set survey opening/closing window
- set activity-specific welcome text
- inspect response counts
- filter results by activity/event
- inspect executive-facing satisfaction results
- export survey responses as CSV

### Lac Learning Game (`mahidol-rac`)
- public games: Bingo, Sobprab Lac Lab and learning experiences
- public satisfaction survey submission
- uses the canonical `activities.id` UUID from the shared Supabase database
- does not own a second administrator identity system

## Data flow

```text
Portal Admin Login
      ↓
Portal Admin Activity Control
      ↓
central public.activities.id
      ↓
Lac game /survey?activity=<UUID>
      ↓
public.survey_responses.activity_id
      ↓
Portal Admin Satisfaction Dashboard / Export
```

## Source of truth

The existing central Supabase PostgreSQL database remains the data source. The Portal accesses it server-side through its existing Drizzle/Postgres data layer; browser code does not receive the database credential.

The canonical activity table is the Portal's existing `public.activities` model. The Lac application must not create a competing activity identity or assume legacy columns such as `date` or `cover_image` when the canonical table uses `activity_date` and `featured_image`.

## Security boundary

The Portal's existing admin authentication remains the first gate. Lac satisfaction administration is exposed only under a Portal `AdminGuard` route and server-side `isAdmin` API checks.

Public respondents may submit only valid, consented responses for activities that are published and currently accepting surveys. Survey analytics/export remain administrator-only.

## Migration rule

Do not introduce a second admin password or second administrator database for Lac. Future Lac admin features must be added to the Portal Admin surface and protected by the same Portal admin boundary.
