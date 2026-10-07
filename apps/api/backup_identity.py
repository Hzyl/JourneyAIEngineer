"""Map portable review keys onto this installation without changing old backups."""
from copy import deepcopy


def remap_review_keys(payload: dict, cards: dict[str, int]) -> dict:
    result = deepcopy(payload)
    for group, field in (("review_state", "id"), ("review_history", "review_id")):
        rows = result.get(group)
        if not isinstance(rows, list):
            continue
        for row in rows:
            if isinstance(row, dict) and "card_key" in row:
                key = row["card_key"]
                row[field] = cards.get(key) if isinstance(key, str) else None
    return result


def metadata_warnings(payload: dict, current: dict) -> list[str]:
    catalog = payload.get("catalog")
    if not isinstance(catalog, dict) or not catalog.get("content_sha256"):
        return ["Backup cũ chưa có fingerprint nội dung; chỉ các lesson/card hợp lệ mới được khôi phục."]
    if catalog["content_sha256"] != current["content_sha256"]:
        return ["Bộ nội dung khác phiên bản hiện tại. Lịch ôn giữ nguyên; hãy kiểm tra lại các bài đã hoàn thành."]
    return []
