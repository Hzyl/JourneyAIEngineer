"""Run offline synthetic labs; real embeddings are available only inside Colab."""
import argparse
import json
from pathlib import Path
import sys
from research_lab import lab_a, lab_b, lab_c


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lab", choices=("a", "b", "c", "all"), default="all")
    parser.add_argument("--embeddings", action="store_true", help="Run genuine pinned embeddings in Colab only")
    parser.add_argument("--split", choices=("dev", "test", "all"), default="dev", help="Lab A evaluation split")
    parser.add_argument("--output", type=Path, help="Write a new JSON report; existing files are never overwritten")
    args = parser.parse_args()
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    try:
        if args.embeddings and args.lab not in ("a", "all"):
            raise ValueError("--embeddings requires --lab a or all")
        if args.output and (args.output.exists() or args.output.suffix.lower() != ".json"):
            raise ValueError("Output must be a new .json file")
        backend = None
        if args.embeddings:
            from research_lab.embeddings import ColabSentenceTransformer
            backend = ColabSentenceTransformer()
        reports = {}
        for name, run in (("a", lambda: lab_a.run(backend, args.split)), ("b", lab_b.run), ("c", lab_c.run)):
            if args.lab in (name, "all"):
                reports[name] = run()
        serialized = json.dumps(reports, ensure_ascii=False, indent=2, allow_nan=False)
        if args.output:
            with args.output.open("x", encoding="utf-8") as stream:
                stream.write(serialized + "\n")
        print(serialized)
        return 0
    except (OSError, ValueError, RuntimeError, ImportError) as error:
        parser.exit(2, f"Research lab error: {error}\n")


if __name__ == "__main__":
    raise SystemExit(main())
