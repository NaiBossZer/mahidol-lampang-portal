# Mahidol Lampang Portal — Media / Storage Matrix

Audit basis: branch `refactor/5-domain-architecture`, current HEAD at audit time, and Supabase production project `rdnbodadxvvykfrxmeqn`.

## Architecture decision

- `portal-media` + `public.portal_media_assets` is the canonical **generic CMS media** implementation.
- `activity-media` + `public.activity_media` remains **domain-specific Activity media** because existing Activity records already use this bucket/table and the current Activity API is dedicated to Activity/post-event photos. New work must not create a second implementation without a documented reason.
- `public.activity_photos` is a legacy media table. Production currently contains 0 rows and no active upload flow was found in the reviewed Activity UX.
- URLs stored in business tables such as `services.featured_image` are accepted only when they are written from the controlled Storage upload result; the actual upload metadata is retained in `portal_media_assets`.

## Matrix

| Domain | Page / Flow | Field | Entity | API | DB table | Storage bucket | Storage path | Upload | Delete | Display | RBAC | RLS | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Programs & Activities | ActivitiesManagementPage | Photo upload | activities | `/api/admin/activity-media` POST/DELETE | `activity_media` | `activity-media` | `activities/{activityId}/{uuid}-{safeName}` | Yes | Yes | `public_url` from `activity_media` | SUPER_ADMIN, CONTENT_ADMIN, OPERATIONS_ADMIN for write | `activity_media_admin_all` + storage insert/update/delete/read policies | **Active / real** |
| Programs & Activities | ActivitiesManagementPage | featuredImage | activities | `/api/admin/activities` + Activity media upload | `activities` + `activity_media` | `activity-media` | Activity media path above | Yes, via Activity photo upload | Media delete via dedicated API | Activity media URL; dashboard has media fallback | Activity roles | Activity table/media RLS | **Controlled URL backed by Storage** |
| Learning & Content | CmsPage → Services | featuredImage | services | `/api/admin/media` POST/DELETE + `/api/admin/services` | `portal_media_assets` + `services.featured_image` | `portal-media` | `services/{serviceId}/featuredImage/{uuid}-{filename}` | Yes | Yes | `services.featured_image` / `public_url` | CONTENT_ADMIN, SUPER_ADMIN | `portal_media_assets_*` + `portal_media_*` storage policies | **Active / real** |
| Learning & Content | CmsPage → Home | image | home_sections | `/api/admin/media` POST/DELETE + `/api/admin/home` | `portal_media_assets` + `home_sections.image` | `portal-media` | `home_sections/{entityId}/image/{uuid}-{filename}` | Yes | Yes | `home_sections.image` / `public_url` | CONTENT_ADMIN, SUPER_ADMIN | Central media policies | **Active / real** |
| Learning & Content | CmsPage → Projects | coverImage | social_projects | `/api/admin/media` POST/DELETE + `/api/admin/projects` | `portal_media_assets` + project cover field | `portal-media` | `social_projects/{projectId}/coverImage/{uuid}-{filename}` | Yes | Yes | Project cover field / `public_url` | CONTENT_ADMIN, SUPER_ADMIN | Central media policies | **Active / real** |
| Learning & Content | CmsPage → Learning Centers | coverImage | learning_centers | `/api/admin/media` POST/DELETE + `/api/admin/learning-centers` | `portal_media_assets` + `learning_centers.cover_image` | `portal-media` | `learning_centers/{centerId}/coverImage/{uuid}-{filename}` | Yes | Yes | Center cover field / `public_url` | OPERATIONS_ADMIN, SUPER_ADMIN | Central media policies | **Active / real** |
| Learning & Content | CmsPage → Partners | logo | partners | `/api/admin/media` POST/DELETE + `/api/admin/partners` | `portal_media_assets` + `partners.logo` | `portal-media` | `partners/{partnerId}/logo/{uuid}-{filename}` | Yes | Yes | `partners.logo` / `public_url` | CONTENT_ADMIN, SUPER_ADMIN | Central media policies | **Active / real** |
| Store | Public checkout / admin order flow | slip upload | orders | `/api/uploads/slip` | Order data + Storage object (metadata path returned) | `order-slips` by environment default | `orders/{YYYY-MM-DD}/{uuid}.{ext}` | Yes, server endpoint | No dedicated delete endpoint found in reviewed source | Path returned to caller | Server-side service-role upload | **Production bucket/config needs verification** | **Unknown / verify deployment env** |
| Legacy | Legacy activity photo model | image_url / thumbnail_url | activity_photos | No active upload API identified in current reviewed Activity flow | `activity_photos` | No active controlled bucket mapping identified | N/A | No | No | Public-read table only | SUPER_ADMIN, CONTENT_ADMIN, OPERATIONS_ADMIN | `activity_photos_public_read` + admin policy | **Legacy / 0 production rows** |

## Production verification snapshot

- Supabase project: `rdnbodadxvvykfrxmeqn`
- `portal-media`: public, 25 MB, JPEG/PNG/WebP/PDF
- `activity-media`: public, 10 MB, JPEG/PNG/WebP
- `activity-images`: exists but has no observed objects in the current production snapshot and is not the active Activity upload bucket in the reviewed code.
- Current production counts: `portal_media_assets = 0`, `activity_media = 3`, `activity_photos = 0`.
- The 3 Activity objects are real objects in `activity-media` and belong to Activity `6a6d682b-c1e1-4c0b-a798-0bd3a5c55881`.

## Required rule for future media fields

Every new file field must be registered in the central contract before UI work is considered complete:

`UI field → API → DB metadata → Storage bucket → deterministic storage path → permission/RLS → display`

A field must never be labelled **Upload** when it only stores an uncontrolled external URL. External resources must be labelled **External URL**.
