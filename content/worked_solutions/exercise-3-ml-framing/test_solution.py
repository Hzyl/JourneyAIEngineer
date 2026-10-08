from dataclasses import replace
from datetime import date, timedelta
import json
from pathlib import Path
import random
import subprocess
import sys
import unittest

from framing import (FEATURES, Order, TRAIN_CUTOFF, build_report, demo_orders,
                     feature_rows, fit_majority, metrics, split_orders)


def sample(identity, ordered_on, label=0):
    return Order(identity, "same-customer", ordered_on, 2, 0, label, label)


class FramingTests(unittest.TestCase):
    def test_label_maturity_boundaries_and_time_order(self):
        rows = [sample("ready", TRAIN_CUTOFF - timedelta(days=30)),
                sample("not-ready", TRAIN_CUTOFF - timedelta(days=29)),
                sample("validation-start", TRAIN_CUTOFF),
                sample("future", date(2026, 8, 1))]
        folds, excluded = split_orders(rows)
        self.assertEqual([row.order_id for row in folds["train"]], ["ready"])
        self.assertEqual([row.order_id for row in folds["validation"]], ["validation-start"])
        self.assertEqual({row["id"] for row in excluded}, {"not-ready", "future"})
        original = demo_orders()
        shuffled = original.copy()
        random.Random(9).shuffle(shuffled)
        self.assertEqual(split_orders(original), split_orders(shuffled))
        self.assertEqual(original, demo_orders())

    def test_baseline_uses_only_training_and_tie_policy_is_fixed(self):
        rows = demo_orders()
        original = build_report(rows)
        changed = [replace(row, returned_30d=1, refund_issued=1)
                   if row.ordered_on >= TRAIN_CUTOFF else row for row in rows]
        self.assertEqual(original["baseline_label"], 0)
        self.assertEqual(build_report(changed)["baseline_label"], original["baseline_label"])
        tie = [sample("a", date(2026, 1, 1), 0), sample("b", date(2026, 1, 2), 1)]
        self.assertEqual(fit_majority(tie), 0)
        self.assertEqual(fit_majority([tie[1]]), 1)
        with self.assertRaises(ValueError):
            fit_majority([])

    def test_features_exclude_future_information_and_identifiers(self):
        rows = demo_orders()
        features = feature_rows(rows)
        self.assertEqual(set(features[0]), set(FEATURES))
        self.assertEqual(features, feature_rows([replace(row, returned_30d=1, refund_issued=1) for row in rows]))
        self.assertNotIn("customer_id", features[0])
        self.assertNotIn("refund_issued", features[0])

    def test_metrics_have_explicit_undefined_cases(self):
        result = metrics([0, 1, 1, 0], [0, 0, 0, 0])
        self.assertEqual((result["tp"], result["tn"], result["fp"], result["fn"]), (0, 2, 0, 2))
        self.assertEqual(result["accuracy"], 0.5)
        self.assertEqual(result["recall"], 0)
        self.assertIsNone(result["precision"])
        self.assertIsNone(metrics([0, 0], [1, 0])["recall"])
        for actual, predicted in [([], []), ([1], []), ([True], [0]), ([2], [0])]:
            with self.assertRaises(ValueError):
                metrics(actual, predicted)

    def test_invalid_records_and_cutoffs_fail_explicitly(self):
        row = demo_orders()[0]
        for rows in [[row, row], [replace(row, items_at_purchase=0)],
                     [replace(row, prior_orders_at_purchase=True)], [replace(row, returned_30d=2)],
                     [replace(row, order_id=" ")], [replace(row, customer_id=123)]]:
            with self.assertRaises(ValueError):
                split_orders(rows)
        with self.assertRaises(ValueError):
            split_orders([row], train_cutoff=date(2026, 7, 1))

    def test_cli_default_withholds_test_metrics_and_reports_exclusions(self):
        for flags in [[], ["--include-test"]]:
            result = subprocess.run([sys.executable, "-S", str(Path(__file__).with_name("framing.py")), *flags],
                                    capture_output=True, text=True, check=True, timeout=10)
            report = json.loads(result.stdout)
            self.assertEqual(report["train"]["n"], 8)
            self.assertEqual(report["train"]["accuracy"], 0.75)
            self.assertEqual(report["validation"]["n"], 4)
            self.assertEqual(len(report["excluded"]), 3)
            self.assertEqual("test" in report, bool(flags))
            self.assertEqual(report["test_metrics_revealed"], bool(flags))
            if flags:
                self.assertEqual(report["test"]["n"], 4)


if __name__ == "__main__":
    unittest.main()
