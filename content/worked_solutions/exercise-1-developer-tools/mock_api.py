"""Practice server bound to loopback; stop it with Ctrl+C."""
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json


class StatusHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path != "/status":
            self.send_error(404, "Unknown route")
            return
        body = json.dumps({"service": "learning-api", "status": "ok"}).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        pass


if __name__ == "__main__":
    with ThreadingHTTPServer(("127.0.0.1", 8765), StatusHandler) as server:
        print("Practice API: http://127.0.0.1:8765/status (Ctrl+C to stop)")
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
