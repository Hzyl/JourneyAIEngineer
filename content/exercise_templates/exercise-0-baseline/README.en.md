# Summarize scores

Implement `summarize_scores(scores)` returning `count`, `total` and `mean`.
Valid scores are finite numbers in [0, 100]. Ignore `None`, retain zero, and
return count 0, total 0 and mean None when there are no observations.
Reject other values, including booleans and numeric strings, with `ValueError`.
Do not mutate the input list. `[0, None, 20]` has count 2, total 20 and mean 10.

Predict test outcomes before reading the reference. Record whether mistakes
came from returns, loops, conditions or missing data to choose further practice.
Use Python 3.11+, without external packages or Git. Run tests in the local app or
use `python -m unittest -v test_exercise.py` with a standalone template.
Web readers run code in their own environment; passing covers the tested cases.
