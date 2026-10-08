-- Run only against a disposable local/staging database via supabase test db.
-- Real foreign keys and account-creation triggers must remain enabled.
begin;
select no_plan();
set local session_replication_role = origin;

create temporary table cascade_owners (label text primary key, id uuid not null);
insert into cascade_owners values ('A', gen_random_uuid()), ('B', gen_random_uuid());
insert into auth.users (id, email)
  select id, 'cascade-' || id::text || '@example.invalid' from cascade_owners;

insert into public.lesson_progress (user_id, lesson_slug, status)
  select id, 'cascade-fixture', 'completed' from cascade_owners;
insert into public.review_state (user_id, card_id, lesson_slug)
  select id, 'cascade-card', 'cascade-fixture' from cascade_owners;
insert into public.review_history
  (user_id, card_id, lesson_slug, rating, interval_days, ease_factor, repetitions, lapses)
  select id, 'cascade-card', 'cascade-fixture', 'good', 1, 2.5, 1, 0 from cascade_owners;
insert into public.notes (user_id, title, body)
  select id, 'Synthetic note', 'Synthetic fixture' from cascade_owners;
insert into public.journal_entries (user_id, week_start, title, body)
  select id, '2026-10-05', 'Synthetic journal', 'Synthetic fixture' from cascade_owners;
insert into public.study_sessions (user_id, minutes)
  select id, 10 from cascade_owners;
insert into public.learning_mutations (user_id, request_id, operation, fingerprint, response)
  select id, gen_random_uuid(), 'session', 'synthetic-receipt', '{}'::jsonb from cascade_owners;

-- Profiles and settings are produced by the real auth.users insertion trigger.
create temporary view cascade_rows as
  select 'profiles' as table_name, user_id, to_jsonb(t) as document from public.profiles t
  union all select 'user_settings', user_id, to_jsonb(t) from public.user_settings t
  union all select 'lesson_progress', user_id, to_jsonb(t) from public.lesson_progress t
  union all select 'review_state', user_id, to_jsonb(t) from public.review_state t
  union all select 'review_history', user_id, to_jsonb(t) from public.review_history t
  union all select 'notes', user_id, to_jsonb(t) from public.notes t
  union all select 'journal_entries', user_id, to_jsonb(t) from public.journal_entries t
  union all select 'study_sessions', user_id, to_jsonb(t) from public.study_sessions t
  union all select 'learning_mutations', user_id, to_jsonb(t) from public.learning_mutations t;

create temporary view cascade_counts as
with tables as (
  select unnest(array['profiles', 'user_settings', 'lesson_progress', 'review_state',
    'review_history', 'notes', 'journal_entries', 'study_sessions', 'learning_mutations']) as name
)
select owners.label, tables.name, count(rows.user_id) as total
from cascade_owners owners cross join tables
left join cascade_rows rows on rows.user_id = owners.id and rows.table_name = tables.name
group by owners.label, tables.name;

create temporary table cascade_before_b as
select table_name, document from cascade_rows
where user_id = (select id from cascade_owners where label = 'B');

select is(total, 1::bigint, label || ' has a real fixture in ' || name)
from cascade_counts order by label, name;

-- Exercise the database side of admin deletion, not Auth HTTP/session behavior.
delete from auth.users where id = (select id from cascade_owners where label = 'A');

select is(total, case when label = 'A' then 0 else 1 end::bigint,
  case when label = 'A' then 'deletion removes A from ' else 'deletion preserves B in ' end || name)
from cascade_counts order by label, name;
select is((select count(*) from auth.users where id = (select id from cascade_owners where label = 'A')),
  0::bigint, 'A auth row is deleted');
select is((select count(*) from auth.users where id = (select id from cascade_owners where label = 'B')),
  1::bigint, 'B auth row survives');
select results_eq(
  $$select table_name, document from cascade_rows
    where user_id = (select id from cascade_owners where label = 'B') order by table_name$$,
  $$select table_name, document from cascade_before_b order by table_name$$,
  'every field of B learning data remains unchanged');

select * from finish();
rollback;
