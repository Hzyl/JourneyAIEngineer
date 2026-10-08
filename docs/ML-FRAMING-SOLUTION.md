# ML framing worked solution — 2026-10-08

The framing lab now has a five-step VI/EN walkthrough, an optional worked answer,
an eight-row data dictionary and a six-row leakage table rendered in the app.
Two downloadable Python files reproduce the example using only the standard
library. The exercise remains self-assessed; opening the answer changes no progress.

## Teaching contract

Predict whether a synthetic order will be returned within 30 days, at purchase
time. Whitelist the item count and prior-order count observed at that time.
Identifiers support auditing, while the return outcome and deliberately future
refund flag cannot enter features. The refund flag mirrors the target only in
this synthetic demonstration; it is not a claim about real refund processes.

Use purchase-date partitions and a conservative 30-day maturity requirement at
each decision cutoff. Rows with immature labels are excluded, never relabeled
negative or silently moved between partitions. Customer overlap is permitted
for the stated future-order deployment within the same customer population;
it does not establish performance for entirely new customers.

Fit the majority baseline only on training labels, with a fixed zero tie policy.
Report confusion counts, accuracy, precision, recall and positive prevalence.
The default report withholds test metrics; an explicit CLI flag reveals them
after choices are frozen. This is educational sequencing, not access control.
Synthetic fixtures and their labels remain visible in the source and tests.

## Verified example

- 19 synthetic orders yield 8 train, 4 validation and 4 test rows. Three rows are
  excluded because their labels are immature at their partition cutoffs.
- Train has six negatives and two positives. A constant-zero prediction yields
  train accuracy 0.75, validation accuracy 0.5 and recall 0 on both partitions.
  Precision is undefined and serialized as JSON null because no positive
  prediction was made.
- Six unittest methods cover maturity boundaries, shuffled row order, training
  isolation, feature exclusions, undefined metrics, invalid records and CLI
  output with/without test disclosure. They pass with Python `-S`.
- The integration test copies the exact download files to a fresh directory
  before running them. The full Python suite passes 66 tests.
- The frontend suite passes 71 tests. The production-browser suite passes all
  16 tests, including VI/EN table semantics, keyboard horizontal scrolling,
  light/dark contrast, 1440px/390px overflow checks, file content and absence of
  browser code execution or local API calls.
- Build, lint and content/fingerprint validation pass. Lint retains the existing
  AuthProvider Fast Refresh warning; the existing hosted bundle-size warning remains.
- Screenshots under ignored `.build/framing-evidence/` were inspected.

## Limits and references

The sample is intentionally tiny and deterministic. It cannot demonstrate model
quality, uncertainty, business impact or generalization. Real data requires exact
timestamps, event/label arrival delays, correct point-in-time joins and a justified
evaluation population. Recall must be considered together with precision, review
capacity and error costs; this lab does not choose a production threshold.

Authoring references, read from official scikit-learn documentation on 2026-10-08:
[data leakage and preprocessing pitfalls](https://scikit-learn.org/stable/common_pitfalls.html#data-leakage)
and [cross-validation for time series](https://scikit-learn.org/stable/modules/cross_validation.html#cross-validation-of-time-series-data).
The example itself does not import scikit-learn or claim to implement TimeSeriesSplit.

No dependency was installed and no production service changed. Thirteen of the
52 exercises now have authored solutions; the remaining 39 are explicitly marked
unavailable. Other ML labs retain their original requirements. Math autograd/plot
verification and broader database, release and pilot gates remain open.
