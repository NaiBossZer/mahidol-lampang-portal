# D3-C — Unified Backend API

Architecture: React/Vite SPA → Vercel Serverless Functions → Neon PostgreSQL via Drizzle ORM.

## Public
- `GET /api/health`
- `GET /api/activities` — published activities only.
- `GET /api/activity?slug=<slug>` — published activity detail.
- `GET /api/centers`
- `GET /api/projects`
- `GET /api/products` — Smart Farm products / vegetable support catalog.

## Admin authentication
- `POST /api/auth/login` — validates server-side `ADMIN_PASSWORD`, sets HttpOnly `admin_session` cookie.
- `POST /api/auth/logout` — clears session cookie.

Admin-only endpoints require the session cookie:
- `GET /api/admin/activities`
- `POST /api/admin/activities`
- `PUT /api/admin/activities?id=<id>`
- `PATCH /api/admin/activities?id=<id>`
- `DELETE /api/admin/activities?id=<id>`
- `GET /api/orders`
- `PATCH /api/orders?id=<id>`
- `POST /api/products`
- `PUT /api/products?id=<id>`
- `DELETE /api/products?id=<id>`
- `PATCH /api/inventory?id=<id>`

## Storefront
- `POST /api/orders` creates an order and order items in one database transaction.
- Product stock is checked and decremented atomically; insufficient stock returns `409`.
- Order status is standardized to `pending | paid | fulfilled | cancelled`.
- Admin order responses include line items and product names.

## Activity lifecycle
`draft → published → archived`

Publishing sets `publishedAt`; public activity APIs never return draft or archived records.

## Database configuration
Configure server-side `DATABASE_URL` and `ADMIN_PASSWORD` before deployment. The current local `.env` does not contain `DATABASE_URL`, so database-backed CRUD cannot be live-tested on this machine until the Neon connection string is supplied/configured.

Never put `DATABASE_URL`, `ADMIN_PASSWORD`, or session secrets behind a `VITE_` prefix.
