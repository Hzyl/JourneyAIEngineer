"""Verify the 24-hour boundary using real Auth and REST on a disposable local stack."""

import argparse
import base64
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


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--workdir', required=True)
    args = parser.parse_args()
    work = Path(args.workdir).resolve()
    if work.parent != ROOT / '.build' or not re.fullmatch('journey-readiness-[a-zA-Z0-9-]+', work.name):
        parser.error('Only a disposable local .build/journey-readiness-* stack is allowed')
    project = re.search(r'^project_id\s*=\s*"([^"]+)"',
                        (work / 'supabase/config.toml').read_text(encoding='utf-8'), re.M)
    if not project or project[1] != work.name:
        parser.error('Workdir and disposable project ID must match')
    result = subprocess.run(['node', str(ROOT / 'node_modules/supabase/dist/supabase.js'),
                             '--workdir', str(work), 'status', '-o', 'json'],
                            capture_output=True, text=True, timeout=30)
    if result.returncode:
        raise RuntimeError('Local status failed; credentials were not logged')
    config = json.loads(result.stdout)
    base = config['API_URL']
    endpoint = urlparse(base)
    if endpoint.scheme != 'http' or endpoint.hostname != '127.0.0.1' or endpoint.port != 55321:
        raise RuntimeError('Only the disposable loopback API on port 55321 is allowed')
    checks = []
    users = []

    def check(label, condition):
        if not condition:
            raise AssertionError(label)
        checks.append(label)

    def request(path, method='GET', body=None, token=None, admin=False):
        key = config['SERVICE_ROLE_KEY'] if admin else config['ANON_KEY']
        headers = {'apikey': key, 'Content-Type': 'application/json'}
        if token or admin:
            headers['Authorization'] = 'Bearer ' + (key if admin else token)
        req = Request(base + path, method=method, headers=headers,
                      data=None if body is None else json.dumps(body).encode())
        try:
            response = urlopen(req, timeout=30)
        except HTTPError as error:
            response = error
        with response:
            payload = response.read()
            return response.status, json.loads(payload) if payload else None

    def sql(statement):
        result = subprocess.run(['docker', 'exec', '-i', 'supabase_db_' + work.name,
                                 'psql', '-U', 'postgres', '-d', 'postgres', '-X', '-qAt',
                                 '-v', 'ON_ERROR_STOP=1'], input=statement,
                                text=True, capture_output=True, timeout=30)
        if result.returncode:
            raise RuntimeError('Local fixture SQL failed')
        return result.stdout.strip()

    def login(email, password):
        code, data = request('/auth/v1/token?grant_type=password', 'POST',
                             {'email': email, 'password': password})
        check('real password sign-in', code == 200 and 'access_token' in data)
        return data

    try:
        for _ in range(2):
            email = f'session-{uuid4()}@example.invalid'
            password = secrets.token_urlsafe(32)
            code, data = request('/auth/v1/admin/users', 'POST',
                                 {'email': email, 'password': password, 'email_confirm': True}, admin=True)
            check('synthetic user created', code == 200 and 'id' in data)
            users.append(str(UUID(data['id'])))
            session = login(email, password)
            if len(users) == 1:
                first = session
                other_device = login(email, password)
            else:
                second = session
        token = first['access_token']
        payload = token.split('.')[1]
        claims = json.loads(base64.urlsafe_b64decode(payload + '=' * (-len(payload) % 4)))
        session_id = str(UUID(claims['session_id']))
        rpc = '/rest/v1/rpc/get_session_deadline'
        code, deadline = request(rpc, 'POST', {}, token)
        check('deadline is readable for the current session', code == 200 and deadline['expires_at'])
        code, refreshed = request('/auth/v1/token?grant_type=refresh_token', 'POST',
                                  {'refresh_token': first['refresh_token']})
        check('real refresh succeeds', code == 200 and 'access_token' in refreshed)
        token = refreshed['access_token']
        code, after = request(rpc, 'POST', {}, token)
        check('refresh does not extend session creation deadline', after['expires_at'] == deadline['expires_at'])
        code, _ = request('/rest/v1/notes', 'POST', {'user_id': users[0], 'title': 'Synthetic',
                          'body': 'Session boundary'}, token)
        check('active session can save a note', code == 201)
        sql(f"update auth.sessions set created_at=now()-interval '24 hours' where id='{session_id}';")
        for label, path, method, body in [
            ('read', '/rest/v1/notes?select=id', 'GET', None),
            ('write', '/rest/v1/notes', 'POST', {'user_id': users[0], 'title': 'Denied', 'body': ''}),
            ('export', '/rest/v1/rpc/export_learning_snapshot', 'POST', {}),
            ('mutation RPC', '/rest/v1/rpc/apply_learning_mutation', 'POST',
             {'p_request_id': str(uuid4()), 'p_operation': 'session', 'p_payload': {'minutes': 5}}),
        ]:
            code, data = request(path, method, body, token)
            check(f'expired session denied: {label}', code in (401, 403) and data.get('code') == '28000')
        code, data = request('/rest/v1/notes?select=id', token=other_device['access_token'])
        check('another session of A remains active', code == 200 and len(data) == 1)
        code, data = request('/rest/v1/notes?select=id', token=second['access_token'])
        check('B remains active and cannot see A note', code == 200 and data == [])
        code, old_refresh = request('/auth/v1/token?grant_type=refresh_token', 'POST',
                                    {'refresh_token': refreshed['refresh_token']})
        if code == 200:
            code, data = request('/rest/v1/notes?select=id', token=old_refresh['access_token'])
            check('a new JWT for the expired session is still denied', code in (401, 403)
                  and data.get('code') == '28000')
        else:
            check('Auth rejected expired session refresh', code in (400, 401, 403))
        sql(f"delete from auth.sessions where id='{session_id}';")
        code, data = request(rpc, 'POST', {}, token)
        check('revoked session returns no deadline', code == 200 and data['expires_at'] is None)
    finally:
        for owner in users:
            code, _ = request(f'/auth/v1/admin/users/{owner}', 'DELETE', admin=True)
            if code not in (200, 404):
                raise RuntimeError('Synthetic user cleanup failed')
    print(json.dumps({'status': 'passed', 'checks': checks, 'count': len(checks)}, indent=2))


if __name__ == '__main__':
    main()
