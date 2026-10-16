"""Exercise the local API through HTTP using only a disposable database."""
from http.client import HTTPConnection
import json
import socket
import threading
import time

import pytest
import uvicorn

from test_api import load_module


@pytest.fixture(scope="module")
def local_server(tmp_path_factory):
    with pytest.MonkeyPatch.context() as patch:
        patch.setenv("JOURNEY_LOCAL_ONLY", "true")
        app = load_module(tmp_path_factory.mktemp("local-http"), patch)
        app.create_note(app.NoteCreate(title="Private fixture", body="Synthetic note"))
        listener = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        listener.bind(("127.0.0.1", 0))
        server = uvicorn.Server(uvicorn.Config(app.app, log_level="error", lifespan="off"))
        thread = threading.Thread(target=server.run, kwargs={"sockets": [listener]}, daemon=True)
        thread.start()
        try:
            deadline = time.monotonic() + 10
            while not server.started and thread.is_alive() and time.monotonic() < deadline:
                time.sleep(0.02)
            assert server.started, "Isolated HTTP server did not start"
            yield listener.getsockname()[1], app
        finally:
            server.should_exit = True
            thread.join(timeout=10)
            listener.close()
            assert not thread.is_alive(), "Isolated HTTP server failed to stop"


def request(port, *, host=None, origin=None, path="/api/notes", method="GET", body=None):
    connection = HTTPConnection("127.0.0.1", port, timeout=5)
    headers = {"Host": host or f"127.0.0.1:{port}"}
    if origin is not None:
        headers["Origin"] = origin
    data = None if body is None else json.dumps(body)
    if data is not None:
        headers["Content-Type"] = "application/json"
    try:
        connection.request(method, path, body=data, headers=headers)
        response = connection.getresponse()
        return response.status, response.read().decode("utf-8")
    finally:
        connection.close()


@pytest.mark.parametrize("host", ["127.0.0.1", "localhost:5173", "[::1]:8000"])
def test_loopback_host_reads_private_fixture(local_server, host):
    status, body = request(local_server[0], host=host)
    assert status == 200
    assert "Private fixture" in body


@pytest.mark.parametrize("host", [
    "untrusted.example", "localhost.untrusted.example", "untrusted@localhost",
    "localhost:99999", "localhost/path", "localhost?query=yes",
])
def test_untrusted_host_cannot_read_local_notes(local_server, host):
    status, body = request(local_server[0], host=host)
    assert status in {400, 403}
    assert "Private fixture" not in body


@pytest.mark.parametrize("origin", [
    "https://untrusted.example", "null", "http://[::1", "http://localhost:invalid",
    "http://untrusted@localhost", "http://localhost/path", "http://localhost?query=yes",
    "",
])
def test_bad_origin_is_denied_without_server_error(local_server, origin):
    status, body = request(local_server[0], origin=origin)
    assert status == 403
    assert "Private fixture" not in body


@pytest.mark.parametrize("origin", ["http://localhost:5173", "http://127.0.0.1:5173", "http://[::1]:8000"])
def test_valid_local_frontend_origin_remains_usable(local_server, origin):
    assert request(local_server[0], origin=origin)[0] == 200


def test_denied_host_does_not_write_learning_data(local_server):
    port, app = local_server
    before = app.list_notes()
    status, _ = request(port, host="untrusted.example", method="POST", path="/api/notes",
                        body={"title": "Must not be saved", "body": "Synthetic blocked write"})
    assert status == 403
    assert app.list_notes() == before


@pytest.mark.parametrize("path", ["/api/security/audit", "/api/roadmap", "/api/settings"])
def test_rebinding_host_is_denied_across_sensitive_read_surfaces(local_server, path):
    assert request(local_server[0], host="untrusted.example", path=path)[0] == 403


def test_duplicate_origin_headers_are_rejected(local_server):
    connection = HTTPConnection("127.0.0.1", local_server[0], timeout=5)
    try:
        connection.putrequest("GET", "/api/notes")
        connection.putheader("Origin", "http://localhost:5173")
        connection.putheader("Origin", "https://untrusted.example")
        connection.endheaders()
        response = connection.getresponse()
        assert response.status == 403
        assert b"Private fixture" not in response.read()
    finally:
        connection.close()


def test_audit_remains_local_when_other_capabilities_are_explicitly_opted_out(local_server, monkeypatch):
    monkeypatch.setenv("JOURNEY_LOCAL_ONLY", "false")
    assert request(local_server[0], host="untrusted.example", path="/api/security/audit")[0] == 403
