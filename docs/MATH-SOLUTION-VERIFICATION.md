# Math worked solutions: verification record

Four math exercises now have authored VI/EN guides, optional solutions, tests and
downloadable dependency lists. They remain self-assessed labs. Showing a solution
does not change progress, and the web reader never executes its Python commands.

## Scope

| Lab | Example | Checks | Output |
| --- | --- | --- | --- |
| Linear algebra | NumPy affine transform and centered SVD/PCA | Shapes, hand result, reconstruction, translation, zero variance | `pca.png` |
| Calculus | Quadratic loss; hand derivative, central differences and PyTorch autograd | Gradient agreement and convergence/oscillation/divergence | `gradient.png` |
| Probability | Bernoulli samples plus a synthetic confusion matrix | Repeatability, moments, precision/recall, undefined conditionals | `histogram.png` |
| Optimization | Linear regression using sample-wise SGD, momentum and Adam | Fitted parameters, holdout loss, reproducibility, no validation leakage, divergent updates | `loss-curves.png` |

Each lab contains five unittest methods. These are authored-example checks, not
an automatic grader for an arbitrary learner solution.

## Current evidence — 2026-10-08

The maintainer approved an isolated environment under `.build/math-verification`.
Python 3.11.15, NumPy 2.4.6, Matplotlib 3.11.2 and PyTorch 2.14.1+cpu were installed
there; `pip check` found no broken requirements. PyTorch came from its official CPU
wheel index. The app virtual environment and bundled Python were not modified.

- All 20 unittest methods passed from fresh temporary copies of the downloadable
  files, including PyTorch autograd compared against analytic and finite-difference
  derivatives at five inputs. No test was skipped.
- All four programs ran successfully and generated their PNG outputs. Evidence,
  image hashes and exact installed dependency versions are recorded under ignored
  `.build/math-evidence-20261008/`.
- All four plots were visually inspected: axes, legends and titles are readable
  without clipping. PCA reconstructs on the horizontal axis with retained variance
  0.8 and squared error 4. Gradient loss converges, stays constant or diverges at
  the demonstrated rates; constant loss at rate 1 does not itself show weight
  oscillation, which is checked numerically and explained in the lesson.
- Bernoulli plots show the observed fractions for 20, 200 and 20,000 samples;
  the final mean is 0.1981 for theoretical probability 0.2. Optimizer plots separate
  train/validation by line style and retain the deliberately slow small-rate run.
- Earlier testing found Adam rate 0.03 failed the unchanged parameter tolerance.
  The authored rate 0.003 passes in this full run. These configurations do not prove
  that one optimizer is universally better, or that validation is a final test set.

This closes the previously pending autograd and plot-runtime checks. It does not
certify arbitrary learner solutions, other dependency versions, GPU behavior or
production deployment. Frontend/browser verification is recorded separately in
`UI-ACCEPTANCE.md` and must not be inferred from these Python checks.

## Reproduce with the verified environment

Run from the repository root with an interpreter containing NumPy, Matplotlib
and CPU-capable PyTorch:

```powershell
python scripts/check_math_solutions.py --python <path-to-prepared-python> --evidence-dir .build/math-evidence
```

The checker runs all four unittest suites and scripts in temporary folders. A
failed process, missing import or missing PNG fails the command. It does not
install dependencies or silently skip tests. Inspect the four copied plots for
axis labels, legends, clipping and agreement with the written explanations.

To run only the three NumPy numerical suites with an existing NumPy interpreter:

```powershell
python scripts/check_math_solutions.py --python <numpy-python> --skip-plots --slug exercise-2-linear-algebra --slug exercise-2-probability --slug exercise-2-optimization
```

This limited command does **not** establish autograd or plotting acceptance.
The main app `npm test` does not install or execute these optional math packages;
run the separate checker before approving the math examples for publication.

## Teaching assumptions

- PCA uses comparable feature scales and unlabeled variance; retained variance
  is not prediction accuracy. Axis signs and tied-eigenvalue bases are not unique.
- The gradient convergence interval is derived for the particular quadratic,
  not arbitrary neural networks. Finite differences use tolerances.
- Bernoulli experiments assume IID samples and use population-form empirical
  variance (`ddof=0`). A fixed seed is reproducibility, not general statistical proof.
- Optimizer examples compare configurations with different rates. Training and
  validation curves are separate; validation never updates parameters. This tiny
  linear dataset does not demonstrate overfitting or certify generalization.

Source changes remain local and unpublished. Deployed Supabase/browser acceptance,
Windows clean-machine verification and real learner pilot evidence remain open.
