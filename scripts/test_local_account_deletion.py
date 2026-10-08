"""Real Auth/Edge acceptance using synthetic users in an isolated local stack only."""

import argparse
import json
from pathlib import Path
import re
import secrets
import subprocess
from urllib.error import HTTPError
from urllib.parse import urlparse
from urllib.request import Request, urlopen
from uuid import UUID, uuid4


ROOT = Path(__file__).resolve().parents[1]
TABLES = ("profiles", "user_settings", "lesson_progress", "review_state", "review_history",
          "notes", "journal_entries", "study_sessions", "learning_mutations")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--workdir", required=True)
    args = parser.parse_args()
    workdir = Path(args.workdir).resolve()
    if workdir.parent != ROOT / ".build" or not re.fullmatch("journey-readiness-[a-zA-Z0-9-]+", workdir.name):
        parser.error("Only an isolated .build/journey-readiness-* workdir is allowed")
    project = re.search(r'^project_id\s*=\s*"([^"]+)"',
                        (workdir / "supabase/config.toml").read_text(encoding="utf-8-sig"), re.M)
    if not project or project[1] != workdir.name:
        parser.error("Workdir and disposable project ID must match")
    status = subprocess.run(
        ["node", str(ROOT / "node_modules/supabase/dist/supabase.js"), "--workdir", str(workdir),
         "status", "-o", "json"], capture_output=True, text=True, timeout=30,
    )
    if status.returncode:
        raise RuntimeError("Local Supabase status failed; credentials were not logged")
    config = json.loads(status.stdout)
    base = config["API_URL"]
    endpoint = urlparse(base)
    if endpoint.scheme != "http" or endpoint.hostname != "127.0.0.1" or endpoint.port != 55321:
        raise RuntimeError("Only the disposable loopback API on port 55321 is allowed")
    anon, service = config["ANON_KEY"], config["SERVICE_ROLE_KEY"]
    container = "supabase_db_" + workdir.name
    origin = "http://127.0.0.1:5173"
    accounts = []
    checks = []

    def sql(statement):
        result = subprocess.run(
            ["docker", "exec", "-i", container, "psql", "-U", "postgres", "-d", "postgres",
             "-X", "-qAt", "-v", "ON_ERROR_STOP=1"],
            input=statement, capture_output=True, text=True, timeout=30,
        )
        if result.returncode:
            raise RuntimeError("Synthetic fixture SQL failed")
        return result.stdout.strip()

    def request(path, method="GET", body=None, token=None, admin=False, extra=None):
        headers = {"apikey": service if admin else anon, "Content-Type": "application/json"}
        if token or admin:
            headers["Authorization"] = "Bearer " + (service if admin else token)
        headers.update(extra or {})
        data = body if isinstance(body, bytes) else None if body is None else json.dumps(body).encode()
        req = Request(base + path, data=data, headers=headers, method=method)
        try:
            response = urlopen(req, timeout=45)
        except HTTPError as error:
            response = error
        with response:
            content = response.read()
            return response.status, json.loads(content) if content else None, response.headers

    def check(label, condition):
        if not condition:
            raise AssertionError(label)
        checks.append(label)

    def snapshot(owner):
        return {table: json.loads(sql(
            f"select coalesce(jsonb_agg(to_jsonb(t) order by to_jsonb(t)::text),'[]'::jsonb) "
            f"from public.{table} t where user_id='{owner}';")) for table in TABLES}

    try:
        for _ in range(2):
            email = f"deletion-{uuid4()}@example.invalid"
            password = secrets.token_urlsafe(32)
            code, user, _ = request("/auth/v1/admin/users", "POST",
                                    {"email": email, "password": password, "email_confirm": True}, admin=True)
            check("synthetic user created", code == 200 and "id" in user)
            owner = str(UUID(user["id"]))
            accounts.append(owner)
            code, session, _ = request("/auth/v1/token?grant_type=password", "POST",
                                       {"email": email, "password": password})
            check("password login works", code == 200 and "access_token" in session)
            if len(accounts) == 1:
                token_a, password_a = session["access_token"], password
            sql(f"""
                insert into public.lesson_progress(user_id,lesson_slug,status)
                  values('{owner}','deletion-fixture','completed');
                insert into public.review_state(user_id,card_id,lesson_slug)
                  values('{owner}','deletion-card','deletion-fixture');
                insert into public.review_history
                  (user_id,card_id,lesson_slug,rating,interval_days,ease_factor,repetitions,lapses)
                  values('{owner}','deletion-card','deletion-fixture','good',1,2.5,1,0);
                insert into public.notes(user_id,title,body) values('{owner}','Test','Synthetic');
                insert into public.journal_entries(user_id,week_start,title,body)
                  values('{owner}','2026-10-05','Test','Synthetic');
                insert into public.study_sessions(user_id,minutes) values('{owner}',10);
                insert into public.learning_mutations(user_id,request_id,operation,fingerprint,response)
                  values('{owner}','{uuid4()}','session','synthetic','{{}}'::jsonb);
            """)
        owner_a, owner_b = accounts
        before_a, before_b = snapshot(owner_a), snapshot(owner_b)
        check("all nine learning tables seeded", all(len(rows) == 1 for rows in
                                                       (*before_a.values(), *before_b.values())))
        path = "/functions/v1/delete-account"
        payload = {"confirmation": "DELETE", "password": password_a}

        code, _, headers = request(path, "OPTIONS", extra={"Origin": origin})
        # Kong can answer OPTIONS itself; enforce the function allowlist on POST below.
        check("gateway preflight", code == 204 and headers.get("Access-Control-Allow-Origin") in (origin, "*"))
        for label, body, token, selected_origin, expected, expected_code in (
            ("missing authorization", payload, None, origin, 401, "authentication_required"),
            ("invalid token", payload, "invalid-token", origin, 401, "authentication_required"),
            ("disallowed origin", payload, token_a, "https://untrusted.example", 403, "origin_not_allowed"),
            ("missing confirmation", {"password": password_a}, token_a, origin, 400, "confirmation_required"),
            ("wrong password", {**payload, "password": "incorrect-password"}, token_a, origin,
             403, "reauthentication_failed"),
            ("oversized body", b"x" * 8193, token_a, origin, 413, "body_too_large"),
            ("invalid UTF8", b"\xff", token_a, origin, 400, "invalid_request"),
        ):
            code, body, headers = request(path, "POST", body, token, extra={"Origin": selected_origin})
            check(label, code == expected and body.get("code") == expected_code)
            # The local Kong CORS plugin overwrites response headers with '*'.
            # The function's origin rejection is verified by its 403/code above.
        check("rejected requests preserve data", snapshot(owner_a) == before_a and snapshot(owner_b) == before_b)
        # A forged target must not redirect deletion to B; identity comes from A's token.
        code, body, _ = request(path, "POST", {**payload, "user_id": owner_b}, token_a,
                                extra={"Origin": origin})
        check("authenticated deletion succeeds", code == 200 and body.get("code") == "account_deleted")
        check("all A learning rows deleted", all(not rows for rows in snapshot(owner_a).values()))
        check("all B learning fields unchanged", snapshot(owner_b) == before_b)
        code, _, _ = request(f"/auth/v1/admin/users/{owner_a}", admin=True)
        check("A removed from Auth", code == 404)
        code, _, _ = request(f"/auth/v1/admin/users/{owner_b}", admin=True)
        check("B remains in Auth", code == 200)
        code, _, _ = request("/auth/v1/user", token=token_a)
        check("old A token cannot identify deleted user", code in (401, 403, 404))
    finally:
        # Only UUIDs returned for users this process created can be removed here.
        for owner in accounts:
            code, _, _ = request(f"/auth/v1/admin/users/{owner}", "DELETE", admin=True)
            if code not in (200, 404):
                raise RuntimeError("Synthetic user cleanup failed")
        if accounts:
            ids = ",".join(f"'{owner}'" for owner in accounts)
            check("synthetic Auth fixtures cleaned", sql(f"select count(*) from auth.users where id in ({ids});") == "0")
    print(json.dumps({"status": "passed", "checks": checks, "count": len(checks)}, indent=2))


if __name__ == "__main__":
    main()
