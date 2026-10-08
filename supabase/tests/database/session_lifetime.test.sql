begin;
select no_plan();

select has_function('public', 'get_session_deadline', array[]::text[], 'session deadline RPC exists');

-- Synthetic users and sessions are rolled back with the test transaction.
insert into auth.users (id, email) values
  ('aaaaaaaa-2424-2424-2424-aaaaaaaaaaaa', 'session-a@example.invalid'),
  ('bbbbbbbb-2424-2424-2424-bbbbbbbbbbbb', 'session-b@example.invalid');
insert into auth.sessions (id, user_id, created_at, updated_at) values
  ('11111111-2424-2424-2424-111111111111', 'aaaaaaaa-2424-2424-2424-aaaaaaaaaaaa',
    now() - interval '23 hours', now()),
  ('22222222-2424-2424-2424-222222222222', 'aaaaaaaa-2424-2424-2424-aaaaaaaaaaaa',
    now() - interval '24 hours', now()),
  ('33333333-2424-2424-2424-333333333333', 'bbbbbbbb-2424-2424-2424-bbbbbbbbbbbb', now(), now());
insert into public.notes(user_id, title, body) values
  ('aaaaaaaa-2424-2424-2424-aaaaaaaaaaaa', 'A', 'Private A'),
  ('bbbbbbbb-2424-2424-2424-bbbbbbbbbbbb', 'B', 'Private B');

set local role authenticated;
set local request.jwt.claim.sub = 'aaaaaaaa-2424-2424-2424-aaaaaaaaaaaa';
set local request.jwt.claims = '{"session_id":"11111111-2424-2424-2424-111111111111"}';
select is((public.get_session_deadline()->>'expires_at')::timestamptz, now() + interval '1 hour',
  'deadline uses session creation, not updated_at or token issue time');
select is((select count(*) from public.notes), 1::bigint, 'active A sees only its note');
select lives_ok($$insert into public.notes(user_id,title,body)
  values(auth.uid(),'Active','Allowed')$$, 'active session can write');

set local request.jwt.claims = '{"session_id":"22222222-2424-2424-2424-222222222222"}';
select is((public.get_session_deadline()->>'expires_at')::timestamptz, now(), 'exact 24-hour deadline');
select throws_ok('select * from public.notes', '28000', 'Session expired. Sign in again.',
  'expired session cannot read private rows');
select throws_ok($$insert into public.notes(user_id,title,body) values(auth.uid(),'Expired','Denied')$$,
  '28000', 'Session expired. Sign in again.', 'expired session cannot insert');
select throws_ok($$update public.notes set body='Denied' where user_id=auth.uid()$$,
  '28000', 'Session expired. Sign in again.', 'expired session cannot update');
select throws_ok('delete from public.notes where user_id=auth.uid()',
  '28000', 'Session expired. Sign in again.', 'expired session cannot delete');
select throws_ok('select public.export_learning_snapshot()',
  '28000', 'Session expired. Sign in again.', 'expired session cannot export');
select throws_ok($$select public.apply_learning_mutation(gen_random_uuid(),'session','{"minutes":5}')$$,
  '28000', 'Session expired. Sign in again.', 'expired session cannot mutate through RPC');

set local request.jwt.claims = '{"session_id":"33333333-2424-2424-2424-333333333333"}';
select is(public.get_session_deadline()->>'expires_at', null::text, 'A cannot use B session ID');
set local request.jwt.claim.sub = 'bbbbbbbb-2424-2424-2424-bbbbbbbbbbbb';
select is((select count(*) from public.notes), 1::bigint, 'B remains active and isolated');
set local request.jwt.claims = '{}';
select is(public.get_session_deadline()->>'expires_at', null::text, 'missing session fails closed');
set local request.jwt.claims = '{"session_id":"invalid"}';
select is(public.get_session_deadline()->>'expires_at', null::text, 'malformed session fails closed');
set local request.jwt.claims = '{"session_id":"44444444-2424-2424-2424-444444444444"}';
select is(public.get_session_deadline()->>'expires_at', null::text, 'revoked or absent session fails closed');
reset role;
update auth.sessions set not_after=now()-interval '1 second'
  where id='33333333-2424-2424-2424-333333333333';
set local role authenticated;
set local request.jwt.claims = '{"session_id":"33333333-2424-2424-2424-333333333333"}';
select throws_ok('select * from public.notes', '28000', 'Session expired. Sign in again.',
  'an earlier server not_after deadline is respected');
reset role;

select ok(not has_function_privilege('anon','public.get_session_deadline()','execute'),
  'anonymous role cannot query a deadline');
select ok(not has_table_privilege('authenticated','auth.sessions','select'),
  'session table is not exposed');
select is((select count(*) from pg_policies where schemaname='public'
  and policyname='require_active_session' and permissive='RESTRICTIVE'), 9::bigint,
  'all nine private learning tables require an active session');
select * from finish();
rollback;
