"""Start the packaged Journey AI Engineer app without leaving a console behind."""

from __future__ import annotations

import os
import socket
import sys
import threading
import time
import traceback
import webbrowser

import uvicorn

from apps.api.main import DATA_ROOT, app, init_db, runtime_has_active_clients


DEFAULT_PORT = 8765
STARTUP_GRACE_SECONDS = 20.0
DISCONNECT_GRACE_SECONDS = 15.0


def choose_port(preferred: int = DEFAULT_PORT) -> int:
    """Pick a free loopback port so an old process cannot block startup."""

    for port in range(preferred, preferred + 20):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
            probe.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            try:
                probe.bind(("127.0.0.1", port))
            except OSError:
                continue
            return port
    raise RuntimeError("Không tìm được port local trống cho Journey AI Engineer.")


def open_browser_later(url: str) -> None:
    time.sleep(0.9)
    webbrowser.open(url, new=2)


def shutdown_watchdog(server: uvicorn.Server) -> None:
    """Stop the packaged server after its last browser tab disconnects.

    The grace period covers a normal page reload and the short delay before a
    browser's ``pagehide``/heartbeat request reaches the local API. Development
    servers are not wired to this watchdog, so ``uvicorn --reload`` keeps its
    usual lifecycle.
    """

    deadline = time.monotonic() + STARTUP_GRACE_SECONDS
    while not server.should_exit:
        if runtime_has_active_clients():
            deadline = time.monotonic() + DISCONNECT_GRACE_SECONDS
        elif time.monotonic() >= deadline:
            server.should_exit = True
            return
        time.sleep(2.0)


def write_startup_error() -> None:
    try:
        DATA_ROOT.mkdir(parents=True, exist_ok=True)
        (DATA_ROOT / "launcher-error.log").write_text(traceback.format_exc(), encoding="utf-8")
    except OSError:
        # There is no console in the packaged build; keep startup failure best-effort.
        pass


def main() -> None:
    try:
        try:
            preferred_port = int(os.environ.get("JOURNEY_PORT", DEFAULT_PORT))
        except ValueError:
            preferred_port = DEFAULT_PORT
        port = choose_port(preferred_port)
        init_db()
        url = f"http://127.0.0.1:{port}"
        if os.environ.get("JOURNEY_NO_BROWSER") != "1":
            threading.Thread(target=open_browser_later, args=(url,), daemon=True).start()

        config = uvicorn.Config(app, host="127.0.0.1", port=port, log_config=None, access_log=False)
        server = uvicorn.Server(config)
        # Only a frozen desktop build owns the browser lifecycle. Keeping this
        # opt-in prevents the development server from shutting down unexpectedly.
        if getattr(sys, "frozen", False) or os.environ.get("JOURNEY_ENABLE_WATCHDOG") == "1":
            threading.Thread(target=shutdown_watchdog, args=(server,), daemon=True).start()
        server.run()
    except Exception:
        write_startup_error()
        raise


if __name__ == "__main__":
    main()
