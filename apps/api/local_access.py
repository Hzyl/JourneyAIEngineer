"""Validate the browser boundary of local-only capabilities."""
from urllib.parse import urlsplit

from fastapi import HTTPException, Request


LOOPBACK_HOSTS = frozenset({"127.0.0.1", "::1", "localhost"})


def _local_http_address(value: str, *, authority: bool = False) -> bool:
    if not value or any(character.isspace() or ord(character) < 32 for character in value):
        return False
    try:
        parsed = urlsplit(f"http://{value}" if authority else value)
        port = parsed.port
        return (
            parsed.scheme in {"http", "https"}
            and parsed.hostname in LOOPBACK_HOSTS
            and parsed.username is None
            and parsed.password is None
            and not parsed.path
            and not parsed.query
            and not parsed.fragment
            and not value.endswith(":")
            and (port is None or 0 < port <= 65535)
        )
    except ValueError:
        return False


def require_loopback_request(request: Request) -> None:
    """Check peer, Host and any Origin before reading or changing local data."""
    client_host = request.client.host if request.client else ""
    if client_host not in LOOPBACK_HOSTS:
        raise HTTPException(403, "This capability is local-only")
    # Checking only the peer IP permits a remote hostname rebound to loopback.
    hosts = request.headers.getlist("host")
    origins = request.headers.getlist("origin")
    if (
        len(hosts) != 1
        or not _local_http_address(hosts[0], authority=True)
        or len(origins) > 1
        or (origins and not _local_http_address(origins[0]))
    ):
        raise HTTPException(403, "This capability is local-only")
