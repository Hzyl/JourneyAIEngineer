-- Retain receipts so an uncertain network response can be retried safely.
create table public.learning_mutations (
  user_id uuid not null references auth.users(id) on delete cascade,
  request_id uuid not null,
  operation text not null check (operation in ('progress', 'review', 'session')),
  fingerprint text not null,
  response jsonb not null,
  created_at timestamptz not null default now(),
  primary key (user_id, request_id)
);

alter table public.learning_mutations enable row level security;
revoke all on public.learning_mutations from public, anon, authenticated;
grant select, insert on public.learning_mutations to authenticated;
create policy learning_mutations_select_own on public.learning_mutations
  for select to authenticated using ((select auth.uid()) = user_id);
create policy learning_mutations_insert_own on public.learning_mutations
  for insert to authenticated with check ((select auth.uid()) = user_id);

create function public.apply_learning_mutation(p_request_id uuid, p_operation text, p_payload jsonb)
returns jsonb
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_fingerprint text;
  v_existing public.learning_mutations;
  v_response jsonb;
  v_progress public.lesson_progress;
  v_review public.review_state;
  v_session public.study_sessions;
begin
  if v_user_id is null then
    raise exception 'Authentication is required' using errcode = '42501';
  end if;
  if p_request_id is null or p_operation is null or p_payload is null
    or jsonb_typeof(p_payload) <> 'object'
    or p_operation not in ('progress', 'review', 'session') then
    raise exception 'Invalid learning mutation' using errcode = '22023';
  end if;
  v_fingerprint := encode(sha256(convert_to(p_operation || ':' || p_payload::text, 'UTF8')), 'hex');
  perform pg_advisory_xact_lock(hashtextextended(v_user_id::text || ':' || p_request_id::text, 0));
  select * into v_existing from public.learning_mutations
    where user_id = v_user_id and request_id = p_request_id;
  if found then
    if v_existing.fingerprint <> v_fingerprint then
      raise exception 'Request ID was reused with different content' using errcode = '22023';
    end if;
    return v_existing.response;
  end if;

  if p_operation = 'progress' then
    select * into v_progress from public.record_lesson_progress(
      p_payload->>'lesson_slug', (p_payload->>'status')::public.lesson_status,
      coalesce((p_payload->>'minutes')::integer, 0)
    );
    v_response := to_jsonb(v_progress);
  elsif p_operation = 'review' then
    select * into v_review from public.answer_review_card(
      p_payload->>'card_id', p_payload->>'lesson_slug', (p_payload->>'rating')::public.review_rating,
      coalesce((p_payload->>'thought_seconds')::integer, 0), coalesce(p_payload->>'answer_text', '')
    );
    v_response := to_jsonb(v_review);
  else
    insert into public.study_sessions(user_id, lesson_slug, minutes, note)
      values(v_user_id, p_payload->>'lesson_slug', (p_payload->>'minutes')::integer,
        coalesce(p_payload->>'note', ''))
      returning * into v_session;
    v_response := to_jsonb(v_session);
  end if;

  insert into public.learning_mutations(user_id, request_id, operation, fingerprint, response)
    values(v_user_id, p_request_id, p_operation, v_fingerprint, v_response);
  return v_response;
end;
$$;

revoke all on function public.apply_learning_mutation(uuid, text, jsonb) from public, anon;
grant execute on function public.apply_learning_mutation(uuid, text, jsonb) to authenticated;
