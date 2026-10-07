# Inspect the running Python

Implement `inspect_environment()` in `starter.py`. Return `major`, `minor`,
`executable` and Boolean `in_venv` from the actual interpreter. Do not hardcode
versions or paths. Compare `sys.prefix` with `sys.base_prefix` for venv detection.

Use Python 3.11+; no external packages or Git are required. The starter should
fail. Implement the function, run tests, then create a venv and compare outputs.
In the local app use Run tests; for a standalone template run
`python -m unittest -v test_exercise.py`. Web readers run tests in their own environment.

Passing verifies this function's tested behavior, not installation of every AI
tool. Save the environment report as an artifact. Read `reference.py` only after
attempting the task and recording where you got stuck.
