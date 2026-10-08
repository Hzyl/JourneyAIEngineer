"""Test signup OTP and branded email using a disposable local Auth/Mailpit stack."""

import argparse
import json
from pathlib import Path
import re
import secrets
import subprocess
import time
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
    mail = config['MAILPIT_URL']
    for url, port in [(base, 55321), (mail, 55324)]:
        endpoint = urlparse(url)
        if endpoint.scheme != 'http' or endpoint.hostname != '127.0.0.1' or endpoint.port != port:
            raise RuntimeError('Only the disposable loopback Auth and Mailpit ports are allowed')
    checks = []
    user_id = None
    email = f'otp-{uuid4()}@example.invalid'
    password = secrets.token_urlsafe(32)

    def check(label, condition):
        if not condition:
            raise AssertionError(label)
        checks.append(label)

    def request(path, body=None, token=None, admin=False, method=None):
        key = config['SERVICE_ROLE_KEY'] if admin else config['ANON_KEY']
        headers = {'apikey': key, 'Content-Type': 'application/json', 'X-Supabase-Api-Version': '2024-01-01'}
        if token or admin:
            headers['Authorization'] = 'Bearer ' + (key if admin else token)
        req = Request(base + path, headers=headers, method=method or ('POST' if body is not None else 'GET'),
                      data=None if body is None else json.dumps(body).encode())
        try:
            response = urlopen(req, timeout=30)
        except HTTPError as error:
            response = error
        with response:
            payload = response.read()
            return response.status, json.loads(payload) if payload else None

    def mailbox(path):
        with urlopen(mail + '/api/v1/' + path, timeout=10) as response:
            return json.load(response)

    def read_code(exclude=None):
        for _ in range(30):
            messages = mailbox('messages')['messages']
            matches = [item for item in messages if item['ID'] != exclude
                       and any(recipient['Address'] == email for recipient in item['To'])]
            if matches:
                message = mailbox('message/' + matches[0]['ID'])
                html = message['HTML']
                code = re.search(r'>\s*(\d{6,32})\s*</p>', html)
                check('email subject identifies Journey AI Engineer',
                      message['Subject'].startswith('Journey AI Engineer'))
                check('email includes a numeric confirmation code', code is not None)
                check('email includes both languages and site identity',
                      'Xác nhận email' in html and 'Verify your email' in html
                      and 'https://journeyaiengineer.pages.dev' in html)
                check('email does not require a token-bearing link',
                      '/auth/v1/verify' not in html and 'token=' not in html and '{{' not in html)
                preview = ROOT / '.build/signup-otp-evidence/email-preview.html'
                preview.parent.mkdir(parents=True, exist_ok=True)
                preview.write_text(html.replace(code[1], '123456').replace(email, 'learner@example.test'),
                                   encoding='utf-8')
                return matches[0]['ID'], code[1]
            time.sleep(0.2)
        raise AssertionError('Mailpit did not capture the synthetic signup email')

    try:
        status, data = request('/auth/v1/signup', {'email': email, 'password': password})
        check('signup requires email confirmation and returns no session', status == 200 and 'access_token' not in data)
        user_id = str(UUID(data['id']))
        message_id, code = read_code()
        status, _ = request('/auth/v1/token?grant_type=password', {'email': email, 'password': password})
        check('password sign-in is blocked before confirmation', status in (400, 403))
        invalid = ('0' if code[0] != '0' else '1') + code[1:]
        status, _ = request('/auth/v1/verify', {'type': 'email', 'email': email, 'token': invalid})
        check('incorrect OTP cannot create a session', status in (400, 403))
        sql = "UPDATE auth.users SET confirmation_sent_at = now() - interval '2 hours' WHERE id = '" + user_id + "';"
        expired = subprocess.run(['docker', 'exec', '-i', 'supabase_db_' + work.name,
                                  'psql', '-U', 'postgres', '-d', 'postgres', '-X', '-qAt',
                                  '-v', 'ON_ERROR_STOP=1'], input=sql,
                                 text=True, capture_output=True, timeout=30)
        if expired.returncode:
            raise RuntimeError('Failed to age the isolated synthetic confirmation')
        status, data = request('/auth/v1/verify', {'type': 'email', 'email': email, 'token': code})
        check('expired OTP returns the expected provider error',
              status in (400, 403) and data.get('code') == 'otp_expired')
        status, _ = request('/auth/v1/resend', {'type': 'signup', 'email': email})
        check('signup resend succeeds', status == 200)
        _, code = read_code(exclude=message_id)
        status, session = request('/auth/v1/verify', {'type': 'email', 'email': email, 'token': code})
        check('signup OTP with type email creates a verified session',
              status == 200 and 'access_token' in session and session['user']['email_confirmed_at'])
        status, deadline = request('/rest/v1/rpc/get_session_deadline', {}, session['access_token'])
        check('verified session passes the app session policy', status == 200 and deadline.get('expires_at'))
        status, _ = request('/auth/v1/verify', {'type': 'email', 'email': email, 'token': code})
        check('consumed OTP cannot be reused', status in (400, 403))
        status, data = request('/auth/v1/token?grant_type=password', {'email': email, 'password': password})
        check('existing password sign-in works after confirmation', status == 200 and 'access_token' in data)
    finally:
        if user_id:
            status, _ = request('/auth/v1/admin/users/' + user_id, admin=True, method='DELETE')
            if status != 200:
                raise RuntimeError('Synthetic user cleanup failed')
    print(json.dumps({'passed': len(checks), 'checks': checks,
                      'scope': 'isolated localhost Auth and Mailpit; no external email'}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
