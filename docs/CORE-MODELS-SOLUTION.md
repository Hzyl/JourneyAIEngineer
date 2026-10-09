# Core models worked solution — 2026-10-09

`exercise-3-models` now has a five-step VI/EN guide and an opt-in solution inside
the existing exercise reader. Three downloadable Python files provide a complete
experiment, model implementations and 11 tests. No package installation is needed.
The lab remains self-assessed; viewing an answer does not change progress.

## Learning outcome and scope

Following ML framing, compare a majority baseline, logistic regression, a shallow
decision tree and binary AdaBoost. Produce `model-comparison.json` plus a short
`decision.md` covering quality, interpretability, latency and data-size limits.
The example targets model comparison and experimental discipline, not production
library replacement or an automatic grader for arbitrary learner solutions.

Use 400 seeded IID synthetic observations with two finite features in [-1, 1].
The underlying target occupies an interval of `signal`; `distractor` is independent.
Each label is independently flipped with probability 8%, not an exact quota.
Train/validation/test sizes are 240/80/80, with disjoint audit IDs. Only training
rows reach fitting. No generating-rule feature, ID or noise flag enters prediction.

Configuration is fixed before evaluation: unregularized logistic gradient descent
(500 steps, rate 0.3, threshold 0.5), a depth-2 weighted-Gini tree, and up to 20
depth-1 binary AdaBoost learners. AdaBoost stops at a perfect stump or error >= 0.5.
Choose validation balanced accuracy; predeclare tie order majority, logistic, tree,
AdaBoost. Default output omits test metrics; `--include-test` evaluates only the
selected model. This is an instructional convention, not access control.

## Reproduced results

| Model | Train accuracy | Validation accuracy | Validation balanced accuracy | TN / FP / FN / TP | Complexity |
| --- | --- | --- | --- | --- | --- |
| Majority | 0.6292 | 0.5375 | 0.5000 | 43 / 0 / 37 / 0 | Constant 0 |
| Logistic | 0.6292 | 0.5375 | 0.5000 | 43 / 0 / 37 / 0 | 3 coefficients |
| Tree | 0.9417 | 0.9500 | 0.9516 | 40 / 3 / 1 / 36 | 7 nodes |
| AdaBoost | 0.9417 | 0.9500 | 0.9516 | 40 / 3 / 1 / 36 | 20 stumps / 60 nodes |

Tree wins the predeclared tie. The first validation error is `validation-001`
(1 predicted as 0) for majority/logistic and `validation-002` (0 predicted as 1)
for tree/AdaBoost. Reports retain full features and labels for these real errors.
Undefined precision is null; balanced accuracy is undefined if a class is absent,
in which case model selection raises an error rather than inventing a score.

The optional held-out evaluation produced tree accuracy 0.825 and balanced
accuracy 0.8210 (TN=39, FP=7, FN=7, TP=27). It did not change model selection.
The lower test score illustrates why validation is not a final estimate.

Timing fields are measured on each run. Prediction timing averages 100 batches
after warmup and includes Python calls/loop overhead. Fit timing covers each
builder, excluding common feature extraction. These measurements are not an
optimized-library comparison, memory estimate, concurrent API benchmark or p95.
The small fixed sample does not establish uncertainty, seed robustness or a
universal winner across datasets. Prediction functions assume the documented
feature shape/domain; do not reuse them as unvalidated public inference endpoints.

## Verification

- 11 standard-library tests pass with `python -S`: known logistic gradient,
  stable sigmoid, tree depth/weighted leaves, AdaBoost stop cases, invalid training
  data, reproducible disjoint splits, hand-checkable metrics, train-only fitting,
  omitted test scores, actual error rows and refusal to overwrite artifacts.
- Eight integration checks pass, copying seven standard-library examples into
  fresh folders and verifying the intentionally buggy regression is rejected.
- 219 frontend unit tests pass, including disclosure, language changes, download
  filenames and explicit unavailability for labs without authored answers.
- Four targeted production-build browser tests pass for framing and Core models,
  VI/EN, light/dark, 1440px/390px, contrast, document overflow, keyboard table scroll,
  exact downloaded file contents and no local API/non-read requests.
- TypeScript, lint, hosted Vite build and content validation pass. Existing
  AuthProvider Fast Refresh and large-bundle warnings remain.
- Screenshots are local ignored artifacts under `.build/models-evidence/`.

No live Supabase configuration or data changed. Core models is a local change
pending publication. There are now 14 authored solutions among 52 exercises;
38 remain explicitly unavailable. Manual acceptance is batched in
[ACCEPTANCE-BATCH.md](ACCEPTANCE-BATCH.md), not marked complete.

## Authoring references

Official scikit-learn sections read on 2026-10-09:
[logistic regression](https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression),
[classification trees](https://scikit-learn.org/stable/modules/tree.html#classification),
and [AdaBoost](https://scikit-learn.org/stable/modules/ensemble.html#adaboost).
The example imports no scikit-learn. It uses unregularized logistic gradient
descent and classic signed binary AdaBoost; it does not claim parity with
scikit-learn defaults, regularization, optimizers or its documented SAMME variant.
