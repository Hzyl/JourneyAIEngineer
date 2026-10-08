"""CSV name,score -> JSON records and row-level errors; standard library only."""
import argparse
import csv
import json
from math import isfinite
from pathlib import Path


def clean_scores(source: Path) -> dict:
    records, errors = [], []
    with source.open(encoding="utf-8-sig", newline="") as stream:
        reader = csv.DictReader(stream)
        if reader.fieldnames != ["name", "score"]:
            raise ValueError("CSV header must be exactly name,score")
        for row in reader:
            # For quoted multiline records, line_num is the ending physical line.
            line = reader.line_num
            if None in row or any(value is None for value in row.values()):
                errors.append({"line": line, "reason": "column_count"})
                continue
            name = row["name"].strip()
            if not name:
                errors.append({"line": line, "reason": "empty_name"})
                continue
            try:
                score = float(row["score"])
            except ValueError:
                errors.append({"line": line, "reason": "invalid_score"})
                continue
            if not isfinite(score) or not 0 <= score <= 100:
                errors.append({"line": line, "reason": "invalid_score"})
                continue
            records.append({"name": name, "score": score})
    return {"records": records, "errors": errors}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    if args.source.resolve() == args.output.resolve():
        parser.error("source and output must be different files")
    try:
        result = clean_scores(args.source)
        args.output.write_text(
            json.dumps(result, ensure_ascii=False, indent=2, allow_nan=False) + "\n",
            encoding="utf-8",
        )
    except (OSError, ValueError, csv.Error) as error:
        parser.exit(1, f"Error: {error}\n")
    print(f"Kept {len(result['records'])}; rejected {len(result['errors'])}")


if __name__ == "__main__":
    main()
