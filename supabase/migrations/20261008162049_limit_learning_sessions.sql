-- Absolute app session lifetime for Supabase Free. Refreshing a JWT does not
-- change auth.sessions.created_at. Keep the per-user ownership policies intact.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create function private.session_expires_at()
returns timestamptz
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  session_key uuid;
  deadline timestamptz;
begin
  if auth.uid() is null then return null; end if;
  begin
    session_key := (auth.jwt()->>'session_id')::uuid;
  exception when invalid_text_representation then
    return null;
  end;
  select least(s.created_at + interval '24 hours', s.not_after)
    into deadline
    from auth.sessions s
    where s.id = session_key and s.user_id = auth.uid() and s.created_at is not null;
  return deadline;
end;
$$;
revoke all on function private.session_expires_at() from public, anon;
grant execute on function private.session_expires_at() to authenticated;

create function public.get_session_deadline()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object('expires_at', private.session_expires_at(), 'server_time', statement_timestamp());
$$;
revoke all on function public.get_session_deadline() from public, anon;
grant execute on function public.get_session_deadline() to authenticated;

create function private.require_active_session()
returns boolean
language plpgsql
stable
security invoker
set search_path = ''
as $$
begin
  if coalesce(private.session_expires_at() > statement_timestamp(), false) then return true; end if;
  raise exception 'Session expired. Sign in again.' using errcode = '28000';
end;
$$;
revoke all on function private.require_active_session() from public, anon;
grant execute on function private.require_active_session() to authenticated;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles', 'user_settings', 'lesson_progress', 'review_state', 'review_history',
    'notes', 'journal_entries', 'study_sessions', 'learning_mutations'
  ] loop
    execute format(
      'create policy require_active_session on public.%I as restrictive for all to authenticated '
      || 'using ((select private.require_active_session())) '
      || 'with check ((select private.require_active_session()))', table_name
    );
  end loop;
end;
$$;
