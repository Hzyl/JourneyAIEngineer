-- One SQL statement provides a consistent snapshot with no PostgREST row cap.
-- SECURITY INVOKER and explicit owner predicates both enforce account isolation.
create function public.export_learning_snapshot()
returns jsonb
language sql
stable
security invoker
set search_path = public, pg_temp
as $$
  select jsonb_build_object(
    'format', 'journey-cloud-export',
    'schema_version', 1,
    'exported_at', statement_timestamp(),
    'owner_id', auth.uid(),
    'profiles', (select coalesce(jsonb_agg(to_jsonb(t) - 'user_id'), '[]')
      from public.profiles t where t.user_id = auth.uid()),
    'user_settings', (select coalesce(jsonb_agg(to_jsonb(t) - 'user_id'), '[]')
      from public.user_settings t where t.user_id = auth.uid()),
    'lesson_progress', (select coalesce(jsonb_agg(to_jsonb(t) - 'user_id' order by lesson_slug), '[]')
      from public.lesson_progress t where t.user_id = auth.uid()),
    'review_state', (select coalesce(jsonb_agg(to_jsonb(t) - 'user_id' order by card_id), '[]')
      from public.review_state t where t.user_id = auth.uid()),
    'review_history', (select coalesce(jsonb_agg(to_jsonb(t) - 'user_id' order by reviewed_at, id), '[]')
      from public.review_history t where t.user_id = auth.uid()),
    'study_sessions', (select coalesce(jsonb_agg(to_jsonb(t) - 'user_id' order by studied_at, id), '[]')
      from public.study_sessions t where t.user_id = auth.uid()),
    'notes', (select coalesce(jsonb_agg(to_jsonb(t) - 'user_id' order by id), '[]')
      from public.notes t where t.user_id = auth.uid()),
    'journal_entries', (select coalesce(jsonb_agg(to_jsonb(t) - 'user_id' order by week_start, id), '[]')
      from public.journal_entries t where t.user_id = auth.uid()),
    'learning_mutations', (select coalesce(jsonb_agg(to_jsonb(t) - 'user_id' order by created_at, request_id), '[]')
      from public.learning_mutations t where t.user_id = auth.uid())
  ) where auth.uid() is not null;
$$;

revoke all on function public.export_learning_snapshot() from public, anon;
grant execute on function public.export_learning_snapshot() to authenticated;
