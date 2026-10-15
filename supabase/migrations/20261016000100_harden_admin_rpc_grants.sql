-- The Supabase default ACL grants newly created functions to anon and
-- authenticated. The admin check must be callable only by signed-in users.
revoke all on function public.is_current_user_admin() from public, anon, authenticated;
grant execute on function public.is_current_user_admin() to authenticated;
