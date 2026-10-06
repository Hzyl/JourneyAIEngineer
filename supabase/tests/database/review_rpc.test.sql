begin;

select plan(14);

select ok(to_regprocedure('public.record_lesson_progress(text,public.lesson_status,integer)') is not null, 'progress write RPC exists');
select ok(to_regprocedure('public.answer_review_card(text,text,public.review_rating,integer,text)') is not null, 'review scheduler RPC exists');
select is((select prosecdef from pg_proc where oid = 'public.record_lesson_progress(text,public.lesson_status,integer)'::regprocedure), false, 'progress RPC uses caller identity');
select is((select prosecdef from pg_proc where oid = 'public.answer_review_card(text,text,public.review_rating,integer,text)'::regprocedure), false, 'review RPC uses caller identity');
select ok(has_function_privilege('authenticated', 'public.record_lesson_progress(text,public.lesson_status,integer)', 'execute'), 'authenticated can record its own progress');
select ok(has_function_privilege('authenticated', 'public.answer_review_card(text,text,public.review_rating,integer,text)', 'execute'), 'authenticated can answer its own review');
select ok(not has_function_privilege('anon', 'public.record_lesson_progress(text,public.lesson_status,integer)', 'execute'), 'anonymous users cannot record progress');
select ok(not has_function_privilege('anon', 'public.answer_review_card(text,text,public.review_rating,integer,text)', 'execute'), 'anonymous users cannot answer reviews');

-- The RPC reads auth.uid() from the same JWT claim that PostgREST supplies.
-- Replication mode bypasses only the auth.users foreign-key fixture here; RLS
-- still evaluates because the caller role is authenticated.
set local session_replication_role = replica;
set local role authenticated;
set local request.jwt.claim.sub = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
select lives_ok($$select public.answer_review_card('phase-00-onboarding-environment-1-recall', 'phase-00-onboarding-environment-1', 'again', 12, 'I need to revisit the setup')$$, 'first again answer is scheduled');
select is((select repetitions from public.review_state where card_id = 'phase-00-onboarding-environment-1-recall'), 0, 'again resets repetitions');
select is((select interval_days from public.review_state where card_id = 'phase-00-onboarding-environment-1-recall'), 1, 'again schedules a one-day lapse interval');
select lives_ok($$select public.answer_review_card('phase-00-onboarding-environment-1-recall', 'phase-00-onboarding-environment-1', 'easy', 8, 'I can explain this now')$$, 'easy answer updates the same card');
select ok((select ease_factor > 2.30 from public.review_state where card_id = 'phase-00-onboarding-environment-1-recall'), 'easy answer raises ease after an earlier lapse');
select is((select count(*) from public.review_history where card_id = 'phase-00-onboarding-environment-1-recall'), 2::bigint, 'every answer has immutable history');

select * from finish();
rollback;
