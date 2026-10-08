"""Fetch a small practice response; no API key or external service required."""
import argparse
import json
from pathlib import Path
from urllib.error import URLError
from urllib.request import urlopen


def save_status(url: str, destination: Path) -> dict:
    with urlopen(url, timeout=3) as response:
        payload = json.load(response)
    if (not isinstance(payload, dict) or set(payload) != {"service", "status"}
            or not isinstance(payload["service"], str) or not payload["service"].strip()
            or payload["status"] != "ok"):
        raise ValueError("Expected non-empty service and status=ok")
    # Validation finishes before writing, so bad responses preserve an existing file.
    destination.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return payload


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("url")
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    try:
        save_status(args.url, args.output)
    except (OSError, URLError, ValueError) as error:
        print(f"Could not save response: {error}")
        return 1
    print(f"Saved {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
