create or replace function public.answer_review_card(
  p_card_id text,
  p_lesson_slug text,
  p_rating public.review_rating,
  p_thought_seconds integer default 0,
  p_answer_text text default ''
)
returns public.review_state
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_state public.review_state;
  v_ease numeric(4,2) := 2.50;
  v_repetitions integer := 0;
  v_lapses integer := 0;
  v_interval integer := 0;
  v_leech boolean := false;
  v_suspended boolean := false;
begin
  if v_user_id is null then
    raise exception 'Authentication is required' using errcode = '42501';
  end if;
  if char_length(trim(p_card_id)) not between 1 and 220 or char_length(trim(p_lesson_slug)) not between 1 and 160 then
    raise exception 'Invalid review card or lesson slug' using errcode = '22023';
  end if;
  if p_thought_seconds not between 0 and 86400 or char_length(p_answer_text) > 50000 then
    raise exception 'Invalid review answer payload' using errcode = '22023';
  end if;

  -- Serialize the card even when its state row does not exist yet.
  perform pg_advisory_xact_lock(hashtextextended(v_user_id::text || ':' || trim(p_card_id), 0));
  if p_card_id is null or p_lesson_slug is null or p_rating is null
    or trim(p_card_id) not in (
      trim(p_lesson_slug) || '-recall', trim(p_lesson_slug) || '-application',
      trim(p_lesson_slug) || '-debug', trim(p_lesson_slug) || '-interview'
    ) then
    raise exception 'Review card does not belong to this lesson' using errcode = '22023';
  end if;

  select * into v_state
  from public.review_state
  where user_id = v_user_id and card_id = trim(p_card_id)
  for update;

  if v_state.last_reviewed_at is null and not exists (
    select 1 from public.lesson_progress
    where user_id = v_user_id and lesson_slug = trim(p_lesson_slug) and status = 'completed'
  ) then
    raise exception 'Complete the lesson before starting its review cards' using errcode = '22023';
  end if;

  if v_state.card_id is not null then
    v_ease := v_state.ease_factor;
    v_repetitions := v_state.repetitions;
    v_lapses := v_state.lapses;
    v_interval := v_state.interval_days;
    v_leech := v_state.leech;
    v_suspended := v_state.suspended;
  end if;

  if p_rating = 'again' then
    v_repetitions := 0;
    v_lapses := v_lapses + 1;
    v_ease := greatest(1.30, v_ease - 0.20);
    v_interval := 1;
  else
    v_repetitions := v_repetitions + 1;
    if p_rating = 'easy' then
      v_ease := least(9.99, greatest(1.30, v_ease + 0.15));
    elsif p_rating = 'hard' then
      v_ease := greatest(1.30, v_ease - 0.15);
    end if;
    if p_rating = 'hard' then
      v_interval := greatest(1, round(greatest(v_interval, 1) * 1.2));
    elsif v_repetitions = 1 then
      v_interval := 1;
    elsif v_repetitions = 2 then
      v_interval := 6;
    else
      v_interval := greatest(1, round(greatest(v_interval, 1) * v_ease * case when p_rating = 'easy' then 1.3 else 1 end));
    end if;
  end if;

  v_interval := least(365, v_interval);
  v_leech := v_leech or v_lapses >= 8;
  v_suspended := v_suspended or v_leech;

  insert into public.review_state (
    user_id, card_id, lesson_slug, due_at, interval_days, repetitions,
    ease_factor, lapses, leech, suspended, last_reviewed_at
  ) values (
    v_user_id, trim(p_card_id), trim(p_lesson_slug), now() + make_interval(days => v_interval),
    v_interval, v_repetitions, v_ease, v_lapses, v_leech, v_suspended, now()
  ) on conflict (user_id, card_id) do update set
    lesson_slug = excluded.lesson_slug,
    due_at = excluded.due_at,
    interval_days = excluded.interval_days,
    repetitions = excluded.repetitions,
    ease_factor = excluded.ease_factor,
    lapses = excluded.lapses,
    leech = excluded.leech,
    suspended = excluded.suspended,
    last_reviewed_at = excluded.last_reviewed_at
  returning * into v_state;

  insert into public.review_history (
    user_id, card_id, lesson_slug, rating, answer_text, thought_seconds,
    interval_days, ease_factor, repetitions, lapses
  ) values (
    v_user_id, trim(p_card_id), trim(p_lesson_slug), p_rating, p_answer_text,
    p_thought_seconds, v_state.interval_days, v_state.ease_factor,
    v_state.repetitions, v_state.lapses
  );
  return v_state;
end;
$$;
