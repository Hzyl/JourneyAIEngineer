begin;
select no_plan();
select ok(not has_function_privilege('anon', 'public.export_learning_snapshot()', 'execute'),
  'anonymous export is denied');
set local session_replication_role = replica;
set local role authenticated;
set local request.jwt.claim.sub = 'aaaaaaaa-3333-3333-3333-aaaaaaaaaaaa';
insert into public.study_sessions(user_id, minutes, note)
  select auth.uid(), 1, 'session ' || value from generate_series(1, 1005) value;
insert into public.notes(user_id, title, body) values(auth.uid(), 'Private A', 'Do not share with B');
select is(jsonb_array_length(public.export_learning_snapshot()->'study_sessions'), 1005,
  'snapshot includes more than 1000 records');
select is(public.export_learning_snapshot()->>'format', 'journey-cloud-export', 'export identifies its format');
select is(public.export_learning_snapshot()->>'owner_id', 'aaaaaaaa-3333-3333-3333-aaaaaaaaaaaa',
  'export identifies the authenticated owner');
select is(public.export_learning_snapshot()->'notes'->0->>'body', 'Do not share with B',
  'owner can export private notes');
set local request.jwt.claim.sub = 'bbbbbbbb-3333-3333-3333-bbbbbbbbbbbb';
select is(jsonb_array_length(public.export_learning_snapshot()->'study_sessions'), 0,
  'B cannot export A sessions');
select is(jsonb_array_length(public.export_learning_snapshot()->'notes'), 0, 'B cannot export A notes');
set local request.jwt.claim.sub = '';
select is(public.export_learning_snapshot(), null::jsonb, 'missing identity returns no snapshot');
select * from finish();
rollback;
