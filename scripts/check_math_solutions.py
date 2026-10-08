"""Run the downloadable math labs in disposable directories, without installing anything."""
import argparse
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile


ROOT = Path(__file__).resolve().parents[1]
LABS = {
    "exercise-2-linear-algebra": ("pca_demo.py", "pca.png"),
    "exercise-2-calculus": ("gradient_demo.py", "gradient.png"),
    "exercise-2-probability": ("probability_demo.py", "histogram.png"),
    "exercise-2-optimization": ("optimizers.py", "loss-curves.png"),
}


def run(command, folder):
    result = subprocess.run(command, cwd=folder, capture_output=True, text=True, timeout=120)
    print(result.stdout + result.stderr)
    if result.returncode:
        raise RuntimeError(f"Command failed ({result.returncode}): {command}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--python", default=sys.executable)
    parser.add_argument("--slug", choices=LABS, action="append")
    parser.add_argument("--skip-plots", action="store_true", help="Check numerical tests only; no plot claim")
    parser.add_argument("--evidence-dir", type=Path, help="Copy generated plots here for visual review")
    args = parser.parse_args()
    for slug in args.slug or LABS:
        with tempfile.TemporaryDirectory(prefix="journey-math-") as temporary:
            target = Path(temporary) / slug
            shutil.copytree(ROOT / "content" / "worked_solutions" / slug, target,
                            ignore=shutil.ignore_patterns("__pycache__", "*.png"))
            print(f"Checking {slug}")
            run([args.python, "-m", "unittest", "-v", "test_solution.py"], target)
            if not args.skip_plots:
                script, output = LABS[slug]
                run([args.python, script], target)
                plot = target / output
                if not plot.is_file() or plot.read_bytes()[:8] != b"\x89PNG\r\n\x1a\n":
                    raise RuntimeError(f"Missing PNG artifact: {output}")
                if args.evidence_dir:
                    args.evidence_dir.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(plot, args.evidence_dir / output)
    print("Selected math numerical checks passed." if args.skip_plots
          else "Selected math tests and plot generation passed; inspect the plots separately.")


if __name__ == "__main__":
    main()
