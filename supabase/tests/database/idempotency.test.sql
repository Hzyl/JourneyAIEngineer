begin;
select no_plan();

select ok((select relrowsecurity from pg_class where oid = 'public.learning_mutations'::regclass),
  'mutation receipts have RLS enabled');
select ok(not has_function_privilege('anon', 'public.apply_learning_mutation(uuid,text,jsonb)', 'execute'),
  'anonymous callers cannot write learning state');

set local session_replication_role = replica;
set local role authenticated;
set local request.jwt.claim.sub = 'dddddddd-dddd-dddd-dddd-dddddddddddd';

select throws_ok($$select public.answer_review_card(
  'phase-00-onboarding-environment-1-recall', 'phase-00-onboarding-environment-1', 'good', 1, ''
)$$, '22023', 'Complete the lesson before starting its review cards', 'new cards require learned lessons');

select lives_ok($$select public.apply_learning_mutation('10000000-0000-0000-0000-000000000001', 'progress',
  '{"lesson_slug":"phase-00-onboarding-environment-1","status":"completed","minutes":25}'::jsonb)$$,
  'progress records a logical request');
select lives_ok($$select public.apply_learning_mutation('10000000-0000-0000-0000-000000000001', 'progress',
  '{"minutes":25,"status":"completed","lesson_slug":"phase-00-onboarding-environment-1"}'::jsonb)$$,
  'retry accepts equivalent JSON with different key order');
select is((select minutes_spent from public.lesson_progress), 25, 'retry does not add minutes twice');
select is((select count(*) from public.study_sessions), 1::bigint, 'retry does not add a second study session');
select throws_ok($$select public.apply_learning_mutation('10000000-0000-0000-0000-000000000001', 'progress',
  '{"lesson_slug":"phase-00-onboarding-environment-1","status":"completed","minutes":30}'::jsonb)$$,
  '22023', 'Request ID was reused with different content', 'conflicting payload is rejected');

select lives_ok($$select public.apply_learning_mutation('10000000-0000-0000-0000-000000000002', 'review',
  '{"card_id":"phase-00-onboarding-environment-1-recall","lesson_slug":"phase-00-onboarding-environment-1","rating":"good"}'::jsonb)$$,
  'first review records state and history');
select lives_ok($$select public.apply_learning_mutation('10000000-0000-0000-0000-000000000002', 'review',
  '{"card_id":"phase-00-onboarding-environment-1-recall","lesson_slug":"phase-00-onboarding-environment-1","rating":"good"}'::jsonb)$$,
  'review retry returns the saved result');
select is((select count(*) from public.review_history), 1::bigint, 'review retry does not duplicate history');
select is((select repetitions from public.review_state), 1, 'review retry does not advance the schedule');

set local request.jwt.claim.sub = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';
select is((select count(*) from public.learning_mutations), 0::bigint, 'B cannot read A receipts');
select is((select count(*) from public.lesson_progress), 0::bigint, 'B cannot read A progress');
select is((select count(*) from public.review_history), 0::bigint, 'B cannot read A review history');
select lives_ok($$select public.apply_learning_mutation('10000000-0000-0000-0000-000000000001', 'session',
  '{"minutes":5,"note":"B fixture"}'::jsonb)$$, 'request IDs are scoped to the authenticated owner');
select is((select sum(minutes) from public.study_sessions), 5::bigint, 'B sees only its own session');
select throws_ok($$insert into public.learning_mutations(user_id,request_id,operation,fingerprint,response)
  values('dddddddd-dddd-dddd-dddd-dddddddddddd','10000000-0000-0000-0000-000000000099','session','bad','{}')$$,
  '42501', 'new row violates row-level security policy for table "learning_mutations"',
  'B cannot create an A receipt');

select * from finish();
rollback;
