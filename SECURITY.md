# Security checklist

## Required before production

- Set `ADMIN_PASSWORD` to a unique random value of at least 12 characters in the deployment secret store.
- Set `DATABASE_URL` in the deployment secret store. The application intentionally fails fast when it is missing.
- Keep `Secure`, `HttpOnly`, `SameSite=Lax` admin cookies enabled behind HTTPS.
- Put rate limiting and bot protection in front of `/api/auth/login` and `/api/orders`.
- Configure database migrations, backups, and least-privilege Neon credentials.
- Replace the legacy Google Apps Script booking endpoint with an authenticated server endpoint and enforce slot-overlap checks server-side.

## Known dependency review

`npm audit --omit=dev` currently reports high-severity advisories in `xlsx` and `pptxgenjs` through `image-size`. Do not expose those export functions to untrusted file input until the packages are replaced or an approved patched release is available.
