"""Start the packaged Journey AI Engineer app and open it in the default browser."""

from __future__ import annotations

import os
import socket
import threading
import time
import traceback
import webbrowser

import uvicorn

from apps.api.main import DATA_ROOT, app, init_db


DEFAULT_PORT = 8765


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
        threading.Thread(target=open_browser_later, args=(url,), daemon=True).start()
        # Windowed PyInstaller builds do not expose a console stream with isatty().
        uvicorn.run(app, host="127.0.0.1", port=port, log_config=None, access_log=False)
    except Exception:
        write_startup_error()
        raise


if __name__ == "__main__":
    main()
