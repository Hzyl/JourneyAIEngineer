"""Run with --write after an intentional curriculum edit; otherwise verify."""
import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from apps.api.catalog_version import catalog_metadata


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--write", action="store_true")
    args = parser.parse_args()
    version = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))["version"]
    expected = catalog_metadata(ROOT / "content", version)
    target = ROOT / "content" / "catalog-version.json"
    if args.write:
        target.write_text(json.dumps(expected, indent=2) + "\n", encoding="utf-8")
    elif not target.exists() or json.loads(target.read_text(encoding="utf-8")) != expected:
        raise SystemExit("Catalog metadata is stale. Run python scripts/catalog_version.py --write")
    print("Catalog fingerprint verified")


if __name__ == "__main__":
    main()
