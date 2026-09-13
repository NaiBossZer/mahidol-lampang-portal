# Central Portal Storage & Media Architecture

## Rule

Every admin `เพิ่ม` / `แก้ไข` field that accepts a file must have an explicit Storage destination. URL text entry is not a substitute for an upload field.

The UI must show the bucket and allowed file types, upload through a Portal API, and persist both Storage metadata and the domain-facing URL.

## Current media matrix

| Domain / field | UI | Storage bucket | Metadata table | Domain value |
| --- | --- | --- | --- | --- |
| Activity `featuredImage` | Activity form | `activity-media` | `activity_media` | `activities.featured_image` |
| Activity post-event gallery | Activity form | `activity-media` | `activity_media` | `activity_media.public_url` |
| CMS Services `featuredImage` | Content & CMS | `portal-media` | `portal_media_assets` | `services.featured_image` |
| CMS Home Section `image` | Content & CMS | `portal-media` | `portal_media_assets` | `home_sections.image` |
| CMS Project `coverImage` | Content & CMS | `portal-media` | `portal_media_assets` | `social_projects.cover_image` |
| Learning Center `coverImage` | Content & CMS | `portal-media` | `portal_media_assets` | `learning_centers.cover_image` |
| Partner `logo` | Content & CMS | `portal-media` | `portal_media_assets` | `partners.logo` |

## Buckets

### `activity-media`

- Public read
- Admin-authenticated mutation through `/api/admin/activity-media`
- JPEG / PNG / WebP
- Maximum 10 MB
- Path: `activities/{activityId}/{uuid}-{filename}`

### `portal-media`

- Public read for published web assets
- Admin-authenticated mutation through `/api/admin/media`
- JPEG / PNG / WebP / PDF
- Maximum 25 MB
- Path: `{entityType}/{entityId}/{fieldKey}/{uuid}-{filename}`

## Canonical metadata

`public.portal_media_assets` records:

- bucket
- storage path
- public URL
- entity type / entity ID
- field key
- media/document type
- MIME type
- size
- original filename
- caption / alt text
- display order
- lifecycle status
- creator
- timestamps

## Save contract

For a single media field:

1. Save the domain record and obtain its UUID.
2. Upload the selected file to the explicit bucket through the Portal API.
3. Persist the Storage metadata in `portal_media_assets`.
4. Persist the returned public URL into the domain field for existing consumers.
5. If metadata persistence fails, delete the uploaded object to avoid an orphaned file.

## Prohibited patterns

- A plain text input asking an administrator to paste an image URL for a new media field.
- Frontend direct writes using a service-role key.
- UI-only image previews without Storage persistence.
- Domain tables referencing a URL while the uploaded object has no metadata record.
- A new file field without an explicit bucket, MIME policy, size limit, and delete/replace strategy.

## Known architecture cleanup

The repository still contains legacy `api/admin/*` Drizzle handlers alongside Cloudflare Pages `functions/api/admin/*` handlers. The Cloudflare runtime path is the canonical deployment path. Legacy handlers must not become a second source of truth; they should be removed or migrated only after route/runtime verification.
