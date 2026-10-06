begin;

select plan(28);

select has_table('public', 'profiles', 'profiles exists');
select has_table('public', 'user_settings', 'user settings exists');
select has_table('public', 'lesson_progress', 'lesson progress exists');
select has_table('public', 'review_state', 'review state exists');
select has_table('public', 'review_history', 'review history exists');
select has_table('public', 'notes', 'notes exists');
select has_table('public', 'journal_entries', 'journal entries exists');
select has_table('public', 'study_sessions', 'study sessions exists');

select ok((select relrowsecurity from pg_class where oid = 'public.profiles'::regclass), 'profiles has RLS');
select ok((select relrowsecurity from pg_class where oid = 'public.user_settings'::regclass), 'user settings has RLS');
select ok((select relrowsecurity from pg_class where oid = 'public.lesson_progress'::regclass), 'lesson progress has RLS');
select ok((select relrowsecurity from pg_class where oid = 'public.review_state'::regclass), 'review state has RLS');
select ok((select relrowsecurity from pg_class where oid = 'public.review_history'::regclass), 'review history has RLS');
select ok((select relrowsecurity from pg_class where oid = 'public.notes'::regclass), 'notes has RLS');
select ok((select relrowsecurity from pg_class where oid = 'public.journal_entries'::regclass), 'journal entries has RLS');
select ok((select relrowsecurity from pg_class where oid = 'public.study_sessions'::regclass), 'study sessions has RLS');

select col_is_pk('public', 'profiles', 'user_id', 'profiles is keyed by user');
select col_is_pk('public', 'user_settings', 'user_id', 'settings is keyed by user');
select has_pk('public', 'lesson_progress', 'lesson progress has a composite primary key');
select has_pk('public', 'review_state', 'review state has a composite primary key');
select col_is_pk('public', 'review_history', 'id', 'review history has a stable row id');
select col_is_pk('public', 'notes', 'id', 'notes has a stable row id');
select col_is_pk('public', 'journal_entries', 'id', 'journal has a stable row id');
select col_is_pk('public', 'study_sessions', 'id', 'study sessions has a stable row id');

select has_fk('public', 'lesson_progress', 'lesson progress belongs to an auth user');
select has_fk('public', 'review_state', 'review state belongs to an auth user');
select has_fk('public', 'review_history', 'review history belongs to an auth user');
select has_fk('public', 'notes', 'notes belong to an auth user');

select * from finish();
rollback;
