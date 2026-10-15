# Admin user directory

The hosted beta admin surface is available at `/admin/users` (with `/admin` kept as a compatibility alias) only after the signed-in session proves the `public.is_current_user_admin()` RPC. The browser never decides admin status from an email address and never receives a service-role key.

## Data and authority

- `public.admin_roles.user_id` is the stable authority key and references `auth.users(id)`. The initial administrator must be granted through a controlled SQL operation after the matching Auth UID is known; the bootstrap email is not hard-coded in the client.
- `public.admin_audit_log` stores the acting admin, target user, action, timestamp and non-secret metadata. The UUID references become null if an account is later deleted, so account deletion is not blocked by audit history. Browser roles have no direct table grants.
- `public.is_current_user_admin()` is `SECURITY DEFINER`, uses a fixed `search_path`, reads `auth.uid()`, and grants execute only to `authenticated`.

## Edge function

`admin-users` has `verify_jwt = false` so the handler can return stable error codes. It manually validates the bearer with the publishable key, checks the admin RPC using the caller token, and uses the service client only for Auth Admin API operations and audit inserts. `ALLOWED_ORIGINS` rejects unknown browser origins.

`GET` accepts `page`, `per_page` (1–100), and `q` (email or ID, max 200 characters). It returns users, total and pagination metadata. `POST` accepts `ban` with a bounded duration, `unban`, or `send_reset` with a UUID target. Self-lockout and targeting another admin are rejected. Password recovery uses the fixed `/auth/callback?mode=recovery` path and never returns a reset link.

## Bootstrap and operations

1. Create or confirm the account in Supabase Auth.
2. Read its Auth UID from the dashboard or a controlled server-side query.
3. Insert that UUID into `public.admin_roles` with `role = 'admin'` and a trusted `granted_by` UUID.
4. Keep the SQL record of the grant with the release evidence. Do not add an email comparison to frontend code.

The migration is intentionally local and un-deployed in this change. Configure `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ALLOWED_ORIGINS`, and `PUBLIC_SITE_URL` only in the Edge Function environment.
