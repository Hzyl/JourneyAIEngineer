"""Return a new list of tags without leaking state between calls."""


def add_tag(tag: str, tags: list[str] | None = None) -> list[str]:
    if not isinstance(tag, str) or not tag.strip():
        raise ValueError("tag must be non-empty text")
    if tags is not None and (
        not isinstance(tags, list)
        or any(not isinstance(item, str) or not item.strip() for item in tags)
    ):
        raise ValueError("tags must be a list of non-empty strings")
    result = [] if tags is None else tags.copy()
    normalized = tag.strip()
    if normalized not in result:
        result.append(normalized)
    return result
