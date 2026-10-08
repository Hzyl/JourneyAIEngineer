begin;

select plan(21);

select is((select count(*) from pg_policies where schemaname = 'public' and tablename = 'profiles'), 4::bigint, 'profiles has one RLS policy per mutable operation');
select is((select count(*) from pg_policies where schemaname = 'public' and tablename = 'user_settings'), 4::bigint, 'user_settings has one RLS policy per mutable operation');
select is((select count(*) from pg_policies where schemaname = 'public' and tablename = 'lesson_progress'), 4::bigint, 'lesson_progress has one RLS policy per mutable operation');
select is((select count(*) from pg_policies where schemaname = 'public' and tablename = 'review_state'), 4::bigint, 'review_state has one RLS policy per mutable operation');
select is((select count(*) from pg_policies where schemaname = 'public' and tablename = 'review_history'), 3::bigint, 'review history is append-only');
select is((select count(*) from pg_policies where schemaname = 'public' and tablename = 'notes'), 4::bigint, 'notes has one RLS policy per mutable operation');
select is((select count(*) from pg_policies where schemaname = 'public' and tablename = 'journal_entries'), 4::bigint, 'journal entries has one RLS policy per mutable operation');
select is((select count(*) from pg_policies where schemaname = 'public' and tablename = 'study_sessions'), 4::bigint, 'study sessions has one RLS policy per mutable operation');

select ok(has_table_privilege('authenticated', 'public.profiles', 'select,insert,update,delete'), 'authenticated has the intended profile privileges');
select ok(has_table_privilege('authenticated', 'public.user_settings', 'select,insert,update,delete'), 'authenticated has the intended settings privileges');
select ok(has_table_privilege('authenticated', 'public.lesson_progress', 'select,insert,update,delete'), 'authenticated has the intended progress privileges');
select ok(has_table_privilege('authenticated', 'public.review_state', 'select,insert,update,delete'), 'authenticated has the intended review-state privileges');
select ok(has_table_privilege('authenticated', 'public.review_history', 'select,insert,update'), 'authenticated may append and read review history');
select ok(not has_table_privilege('authenticated', 'public.review_history', 'delete'), 'authenticated cannot delete review history');
select ok(has_table_privilege('authenticated', 'public.notes', 'select,insert,update,delete'), 'authenticated has the intended note privileges');
select ok(has_table_privilege('authenticated', 'public.journal_entries', 'select,insert,update,delete'), 'authenticated has the intended journal privileges');

-- Seed rows with deterministic IDs before dropping to the authenticated role.
-- These policy-only fixtures bypass foreign keys. Account creation and real
-- cascading foreign keys are covered separately in account_cascade.test.sql.
set local session_replication_role = replica;
insert into public.notes (id, user_id, title, body) values
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'A private note', 'owner A'),
  ('22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'B private note', 'owner B');
set local role authenticated;

set local request.jwt.claim.sub = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
select results_eq('select count(*) from public.notes', array[1::bigint], 'user A reads only user A rows');

set local request.jwt.claim.sub = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
select results_eq('select count(*) from public.notes', array[1::bigint], 'user B reads only user B rows');
select results_eq($$select count(*) from public.notes where user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid$$, array[0::bigint], 'user B cannot select user A rows directly');
select is_empty($$update public.notes set body = 'changed by B' where user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid returning id$$, 'user B cannot update user A rows');
select lives_ok($$insert into public.notes (user_id, title, body) values ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'B owns this', 'allowed')$$, 'user B can create a row for itself');

select * from finish();
rollback;
