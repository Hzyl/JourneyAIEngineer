"""Line-level ingestion and exact provenance for the synthetic fixtures."""
import hashlib
import json
from pathlib import Path
import re
import unicodedata

DATA = Path(__file__).parent / "data"


def canonical_hash(value):
    raw = json.dumps(value, sort_keys=True, ensure_ascii=False, separators=(",", ":"))
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def load_data(name):
    return json.loads((DATA / name).read_text(encoding="utf-8"))


def tokens(text):
    """Accent-insensitive matching only; original text is retained for citations."""
    plain = unicodedata.normalize("NFD", text.casefold().replace("đ", "d"))
    return set(re.findall(r"\w+", "".join(c for c in plain if unicodedata.category(c) != "Mn")))


def ingest(documents):
    chunks, issues, identities, contents = [], [], {}, {}
    for doc in documents:
        if not isinstance(doc, dict):
            raise ValueError("Document must be an object")
        for field in ("document_id", "version", "text"):
            if not isinstance(doc.get(field), str):
                raise ValueError(f"Missing string document field: {field}")
        if not doc["document_id"] or not doc["version"]:
            raise ValueError("Document id and version cannot be empty")
        users = doc.get("allowed_users")
        if not isinstance(users, list) or any(u not in ("A", "B") for u in users):
            raise ValueError("ACL must be an explicit list of known users; empty means deny all")
        identity = (doc["document_id"], doc["version"])
        if identity in identities:
            if identities[identity] != doc:
                raise ValueError("Conflicting content or ACL for the same document/version")
            issues.append({"kind": "duplicate_identity_skipped", "document_id": identity[0]})
            continue
        identities[identity] = doc
        if not doc["text"].strip():
            issues.append({"kind": "empty_document", "document_id": identity[0]})
            continue
        content_hash = canonical_hash(unicodedata.normalize("NFC", doc["text"]))
        if content_hash in contents:
            # Do not merge aliases: each source retains its own ACL and attribution.
            issues.append({"kind": "duplicate_content_retained", "document_id": identity[0]})
        contents[content_hash] = identity
        lines = doc["text"].splitlines()
        keys = doc.get("fact_keys", [None] * len(lines))
        if not isinstance(keys, list) or len(keys) != len(lines):
            raise ValueError("fact_keys must align with source lines")
        for line, (text, fact_key) in enumerate(zip(lines, keys), 1):
            if text.strip():
                chunks.append({"document_id": identity[0], "version": identity[1],
                               "chunk_id": f"{identity[0]}@{identity[1]}:L{line}",
                               "line": line, "text": text, "allowed_users": sorted(set(users)),
                               "fact_key": fact_key})
    return chunks, issues


def exact_citation(citation, chunks, user):
    """Checks source existence/ACL/exact text, NOT semantic support for an answer."""
    fields = ("document_id", "version", "chunk_id", "line", "text", "allowed_users")
    return isinstance(citation, dict) and any(
        user in chunk["allowed_users"] and all(citation.get(k) == chunk[k] for k in fields)
        for chunk in chunks
    )


def load_fixture():
    corpus = load_data("documents.json")
    fixture = load_data("questions.json")
    chunks, issues = ingest(corpus["documents"])
    by_id = {c["chunk_id"]: c for c in chunks}
    ids, questions = set(), set()
    for case in fixture["questions"]:
        if case["id"] in ids or tuple(sorted(tokens(case["question"]))) in questions:
            raise ValueError("Duplicate question id or normalized question")
        ids.add(case["id"])
        questions.add(tuple(sorted(tokens(case["question"]))))
        if case["split"] not in ("dev", "test") or case["category"] not in (
            "answerable", "unanswerable", "ambiguous"
        ):
            raise ValueError("Invalid split/category")
        for gold in case["gold"]:
            if gold not in by_id or case["user"] not in by_id[gold]["allowed_users"]:
                raise ValueError("Gold evidence missing or unauthorized")
        expected = {"answerable": "answer", "unanswerable": "abstain", "ambiguous": "clarify"}
        if case["expected_action"] != expected[case["category"]]:
            raise ValueError("Invalid expected action")
        if case["category"] == "answerable" and not case["gold"]:
            raise ValueError("Answerable case needs gold evidence")
    provenance = {"corpus_version": corpus["version"], "fixture_version": fixture["version"],
                  "corpus_sha256": canonical_hash(corpus), "fixture_sha256": canonical_hash(fixture),
                  "hash_convention": "SHA256 of canonical UTF-8 JSON, sorted keys, compact separators"}
    return chunks, fixture["questions"], issues, provenance
