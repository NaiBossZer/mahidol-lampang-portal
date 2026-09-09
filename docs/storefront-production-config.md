# Storefront Production Configuration

## 1. PromptPay

Set these Vite environment variables in the deployment environment:

```env
VITE_PROMPTPAY_ID=YOUR_PROMPTPAY_PHONE_OR_ID
VITE_PROMPTPAY_NAME=YOUR_ACCOUNT_NAME
```

`VITE_PROMPTPAY_ID` is intentionally a public frontend value because it is displayed to customers and used to generate the payment QR amount.

Do not keep a real PromptPay ID hardcoded in source code.

## 2. Private slip storage

Create a **private** Supabase Storage bucket named `order-slips`.

Server environment variables:

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
SUPABASE_STORAGE_BUCKET=order-slips
```

`SUPABASE_SERVICE_ROLE_KEY` must only exist in the server/deployment environment. Never expose it through `VITE_*` variables.

The browser uploads the selected slip to `/api/uploads/slip`. The server stores it in Supabase Storage and saves only the storage path in `orders.slip_url`.

The admin orders API returns a temporary signed URL valid for 1 hour, so the bucket does not need to be public.

## 3. Production data source

Fresh Market uses the central `products` table as the source of truth for:

- product name
- description/category
- price and unit
- stock quantity
- preorder status
- harvest date
- research tag
- plot reference
- product image

No Smart Farm API or Smart Farm database is required for storefront operation.

## 4. Storage security

Keep the `order-slips` bucket private. Do not add public read access for the bucket. The server-side service-role key performs uploads and creates short-lived signed URLs for authenticated admin requests.

Recommended additional controls before public launch:

- rate-limit `/api/uploads/slip`
- rate-limit `/api/orders`
- validate file MIME type and size server-side
- keep the admin authentication cookie Secure/HttpOnly/SameSite=Lax
- periodically remove abandoned/unreferenced slip objects
