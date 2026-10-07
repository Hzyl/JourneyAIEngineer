"""Exercise concurrent writes against an explicitly isolated local test container."""

import argparse
from concurrent.futures import ThreadPoolExecutor
import json
import re
import subprocess
import threading
from uuid import uuid4


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

    owner = str(uuid4())
    lesson = "phase-00-onboarding-environment-1"
    sql(f"insert into auth.users(id,email) values('{owner}','{owner}@example.invalid');")
    identity = f"set local role authenticated; set local request.jwt.claim.sub = '{owner}';"
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
        print(json.dumps({"concurrent_first_reviews": distinct, "concurrent_retry": retry, "status": "passed"}))
    finally:
        # This UUID was created by this process in the guarded test-only container.
        sql(f"delete from auth.users where id='{owner}';")


if __name__ == "__main__":
    main()
