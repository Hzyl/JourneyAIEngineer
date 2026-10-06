create type public.lesson_status as enum ('not_started', 'in_progress', 'completed', 'needs_review');
create type public.review_rating as enum ('again', 'hard', 'good', 'easy');

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (char_length(display_name) <= 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  language text not null default 'vi' check (language in ('vi', 'en')),
  track text not null default 'standard' check (track in ('standard', 'accelerated')),
  weekly_goal_minutes integer not null default 720 check (weekly_goal_minutes between 60 and 10080),
  show_completed_lessons boolean not null default true,
  target_role text not null default 'internship' check (target_role in ('internship', 'junior', 'career_switch')),
  experience_level text not null default 'beginner' check (experience_level in ('beginner', 'intermediate', 'advanced')),
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_slug text not null check (char_length(lesson_slug) between 1 and 160),
  status public.lesson_status not null default 'not_started',
  minutes_spent integer not null default 0 check (minutes_spent between 0 and 1000000),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_slug)
);

create table public.review_state (
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id text not null check (char_length(card_id) between 1 and 220),
  lesson_slug text not null check (char_length(lesson_slug) between 1 and 160),
  due_at timestamptz not null default now(),
  interval_days integer not null default 0 check (interval_days between 0 and 365),
  repetitions integer not null default 0 check (repetitions >= 0),
  ease_factor numeric(4,2) not null default 2.50 check (ease_factor between 1.30 and 9.99),
  lapses integer not null default 0 check (lapses >= 0),
  leech boolean not null default false,
  suspended boolean not null default false,
  last_reviewed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, card_id)
);

create table public.review_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id text not null check (char_length(card_id) between 1 and 220),
  lesson_slug text not null check (char_length(lesson_slug) between 1 and 160),
  rating public.review_rating not null,
  answer_text text not null default '' check (char_length(answer_text) <= 50000),
  thought_seconds integer not null default 0 check (thought_seconds between 0 and 86400),
  interval_days integer not null check (interval_days between 0 and 365),
  ease_factor numeric(4,2) not null check (ease_factor between 1.30 and 9.99),
  repetitions integer not null check (repetitions >= 0),
  lapses integer not null check (lapses >= 0),
  reviewed_at timestamptz not null default now()
);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_slug text check (lesson_slug is null or char_length(lesson_slug) between 1 and 160),
  title text not null check (char_length(title) between 1 and 200),
  body text not null check (char_length(body) <= 50000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  title text not null check (char_length(title) between 1 and 200),
  body text not null check (char_length(body) <= 50000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_start)
);

create table public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_slug text check (lesson_slug is null or char_length(lesson_slug) between 1 and 160),
  minutes integer not null check (minutes between 1 and 1440),
  note text not null default '' check (char_length(note) <= 50000),
  studied_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index lesson_progress_user_updated_idx on public.lesson_progress (user_id, updated_at desc);
create index review_state_due_idx on public.review_state (user_id, due_at) where suspended = false;
create index review_history_user_reviewed_idx on public.review_history (user_id, reviewed_at desc);
create index notes_user_updated_idx on public.notes (user_id, updated_at desc);
create index journal_entries_user_week_idx on public.journal_entries (user_id, week_start desc);
create index study_sessions_user_studied_idx on public.study_sessions (user_id, studied_at desc);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger user_settings_set_updated_at before update on public.user_settings
for each row execute function public.set_updated_at();
create trigger lesson_progress_set_updated_at before update on public.lesson_progress
for each row execute function public.set_updated_at();
create trigger review_state_set_updated_at before update on public.review_state
for each row execute function public.set_updated_at();
create trigger notes_set_updated_at before update on public.notes
for each row execute function public.set_updated_at();
create trigger journal_entries_set_updated_at before update on public.journal_entries
for each row execute function public.set_updated_at();

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, left(coalesce(new.raw_user_meta_data ->> 'display_name', ''), 80))
  on conflict (user_id) do nothing;
  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

revoke all on function public.handle_new_user() from public, anon, authenticated;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles', 'user_settings', 'lesson_progress', 'review_state',
    'review_history', 'notes', 'journal_entries', 'study_sessions'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('revoke all on table public.%I from anon, authenticated', table_name);
    if table_name = 'review_history' then
      execute format('grant select, insert, update on table public.%I to authenticated', table_name);
    else
      execute format('grant select, insert, update, delete on table public.%I to authenticated', table_name);
    end if;
    execute format(
      'create policy %I on public.%I for select to authenticated using ((select auth.uid()) is not null and (select auth.uid()) = user_id)',
      table_name || '_select_own', table_name
    );
    execute format(
      'create policy %I on public.%I for insert to authenticated with check ((select auth.uid()) is not null and (select auth.uid()) = user_id)',
      table_name || '_insert_own', table_name
    );
    execute format(
      'create policy %I on public.%I for update to authenticated using ((select auth.uid()) is not null and (select auth.uid()) = user_id) with check ((select auth.uid()) is not null and (select auth.uid()) = user_id)',
      table_name || '_update_own', table_name
    );
    if table_name <> 'review_history' then
      execute format(
        'create policy %I on public.%I for delete to authenticated using ((select auth.uid()) is not null and (select auth.uid()) = user_id)',
        table_name || '_delete_own', table_name
      );
    end if;
  end loop;
end;
$$;
