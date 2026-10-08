"""Exercise concurrent writes against an explicitly isolated local test container."""

import argparse
from concurrent.futures import ThreadPoolExecutor
import json
from pathlib import Path
import re
import subprocess
import threading
from uuid import uuid4


def check_trigger_migration(sql):
    migration = (Path(__file__).resolve().parents[1] / "supabase" / "migrations"
                 / "20261007000400_restrict_rls_trigger_execution.sql").read_text(encoding="utf-8")
    # All fixture DDL, including removal of the fixture function, rolls back.
    # The connection is restricted to a journey-readiness local test container.
    sql("""begin;
        do $$ begin
          if to_regprocedure('public.rls_auto_enable()') is null then
            execute 'create function public.rls_auto_enable() returns event_trigger
              language plpgsql as $body$ begin return; end; $body$';
          end if;
        end $$;
        create event trigger journey_readiness_trigger_fixture on ddl_command_end
          execute function public.rls_auto_enable();
        grant execute on function public.rls_auto_enable() to public, anon, authenticated;
        create temporary table trigger_before as
          select pg_get_functiondef('public.rls_auto_enable()'::regprocedure) as definition,
            (select jsonb_agg(to_jsonb(e) order by e.oid) from pg_event_trigger e
              where e.evtfoid = 'public.rls_auto_enable()'::regprocedure) as registrations;
        """ + migration + """
        do $$ begin
          if has_function_privilege('anon', 'public.rls_auto_enable()', 'execute')
            or has_function_privilege('authenticated', 'public.rls_auto_enable()', 'execute') then
            raise exception 'Migration 004 left client EXECUTE permissions';
          end if;
          if pg_get_functiondef('public.rls_auto_enable()'::regprocedure)
              is distinct from (select definition from trigger_before) then
            raise exception 'Migration 004 changed the platform function body';
          end if;
          if (select jsonb_agg(to_jsonb(e) order by e.oid) from pg_event_trigger e
              where e.evtfoid = 'public.rls_auto_enable()'::regprocedure)
              is distinct from (select registrations from trigger_before) then
            raise exception 'Migration 004 changed event trigger registrations';
          end if;
        end $$;
        drop function public.rls_auto_enable() cascade;
        """ + migration + """
        do $$ begin
          if to_regprocedure('public.rls_auto_enable()') is not null then
            raise exception 'Migration 004 created an absent platform function';
          end if;
        end $$;
        create function public.rls_auto_enable() returns integer language sql as 'select 1';
        grant execute on function public.rls_auto_enable() to public, anon, authenticated;
        """ + migration + """
        do $$ begin
          if not has_function_privilege('anon', 'public.rls_auto_enable()', 'execute')
            or not has_function_privilege('authenticated', 'public.rls_auto_enable()', 'execute') then
            raise exception 'Migration 004 changed an unrelated scalar function';
          end if;
        end $$;
        rollback;
    """)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--container", required=True)
    args = parser.parse_args()
    if not re.fullmatch(r"supabase_db_journey-readiness-[a-zA-Z0-9-]+", args.container):
        parser.error("Only an isolated journey-readiness test container is allowed")

    def sql(statement):
        result = subprocess.run(
            ["docker", "exec", "-i", args.container, "psql", "-U", "postgres", "-d", "postgres",
             "-X", "-qAt", "-v", "ON_ERROR_STOP=1"],
            input=statement, encoding="utf-8", capture_output=True, timeout=30,
        )
        if result.returncode:
            raise RuntimeError(result.stderr)
        return result.stdout.strip()

    check_trigger_migration(sql)
    owner = str(uuid4())
    lesson = "phase-00-onboarding-environment-1"
    sql(f"insert into auth.users(id,email) values('{owner}','{owner}@example.invalid');")
    sql(f"insert into auth.sessions(id,user_id,created_at,updated_at) values('{owner}','{owner}',now(),now());")
    identity = (f"set local role authenticated; set local request.jwt.claim.sub = '{owner}';"
                f"set local request.jwt.claims = '{{\"session_id\":\"{owner}\"}}';")
    sql(f"begin; {identity} select public.record_lesson_progress('{lesson}','completed',0); commit;")

    def run_pair(suffix, same_request):
        request = str(uuid4())
        card = f"{lesson}-{suffix}"
        payload = json.dumps({"card_id": card, "lesson_slug": lesson, "rating": "good"})
        barrier = threading.Barrier(2)

        def answer(index):
            request_id = request if same_request or index == 0 else str(uuid4())
            barrier.wait(timeout=10)
            return sql(f"""begin;
                {identity}
                select public.apply_learning_mutation('{request_id}','review','{payload}'::jsonb);
                select pg_sleep(0.5);
                commit;""")

        with ThreadPoolExecutor(max_workers=2) as executor:
            list(executor.map(answer, (0, 1)))
        result = sql(f"""select json_build_object(
            'repetitions',(select repetitions from public.review_state where user_id='{owner}' and card_id='{card}'),
            'history',(select count(*) from public.review_history where user_id='{owner}' and card_id='{card}')
        );""")
        state = json.loads(result)
        expected = 1 if same_request else 2
        assert state == {"repetitions": expected, "history": expected}, state
        return state

    try:
        distinct = run_pair("recall", False)
        retry = run_pair("application", True)
        print(json.dumps({"migration_004": "passed", "concurrent_first_reviews": distinct,
                          "concurrent_retry": retry, "status": "passed"}))
    finally:
        # This UUID was created by this process in the guarded test-only container.
        sql(f"delete from auth.users where id='{owner}';")


if __name__ == "__main__":
    main()
