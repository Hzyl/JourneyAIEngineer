from http.server import ThreadingHTTPServer
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import threading
from urllib.error import HTTPError
import unittest
from unittest.mock import patch

from fetch_status import save_status
from mock_api import StatusHandler


class FixtureHandler(StatusHandler):
    def do_GET(self):
        bodies = {"/broken": b"not JSON", "/wrong": b'{"service":"", "status":"ok"}'}
        if self.path not in bodies:
            return super().do_GET()
        body = bodies[self.path]
        self.send_response(200)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


class WorkflowTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = ThreadingHTTPServer(("127.0.0.1", 0), FixtureHandler)
        cls.worker = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.worker.start()
        cls.url = f"http://127.0.0.1:{cls.server.server_port}"

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.worker.join(timeout=3)

    def setUp(self):
        self.folder = tempfile.TemporaryDirectory()
        self.addCleanup(self.folder.cleanup)
        self.output = Path(self.folder.name) / "response.json"
        self.output.write_text("previous output", encoding="utf-8")

    def test_success_and_repeatable_response(self):
        payload = save_status(self.url + "/status", self.output)
        self.assertEqual(payload, {"service": "learning-api", "status": "ok"})
        self.assertEqual(json.loads(self.output.read_text(encoding="utf-8")), payload)
        before = self.output.read_bytes()
        save_status(self.url + "/status", self.output)
        self.assertEqual(self.output.read_bytes(), before)

    def test_http_failure_preserves_file(self):
        with self.assertRaises(HTTPError):
            save_status(self.url + "/missing", self.output)
        self.assertEqual(self.output.read_text(), "previous output")
        with patch("fetch_status.urlopen", side_effect=TimeoutError("timed out")):
            with self.assertRaises(TimeoutError):
                save_status(self.url + "/status", self.output)
        self.assertEqual(self.output.read_text(), "previous output")

    def test_bad_json_preserves_file(self):
        with self.assertRaises(ValueError):
            save_status(self.url + "/broken", self.output)
        self.assertEqual(self.output.read_text(), "previous output")

    def test_bad_schema_preserves_file(self):
        with self.assertRaises(ValueError):
            save_status(self.url + "/wrong", self.output)
        self.assertEqual(self.output.read_text(), "previous output")

    def test_cli_exit_status_and_output(self):
        for route, expected in [("/status", 0), ("/missing", 1)]:
            result = subprocess.run(
                [sys.executable, "-S", "fetch_status.py", self.url + route, str(self.output)],
                capture_output=True, text=True, timeout=8,
            )
            self.assertEqual(result.returncode, expected, result.stdout + result.stderr)
        self.assertEqual(json.loads(self.output.read_text())["status"], "ok")


if __name__ == "__main__":
    unittest.main()
