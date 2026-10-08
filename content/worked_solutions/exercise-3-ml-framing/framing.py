"""Synthetic 30-day return prediction. Python standard library only."""
import argparse
from dataclasses import dataclass
from datetime import date, timedelta
import json


FEATURES = ("items_at_purchase", "prior_orders_at_purchase")
TRAIN_CUTOFF = date(2026, 3, 1)
VALIDATION_CUTOFF = date(2026, 6, 1)
TEST_AS_OF = date(2026, 8, 1)


@dataclass(frozen=True)
class Order:
    order_id: str
    customer_id: str
    ordered_on: date
    items_at_purchase: int
    prior_orders_at_purchase: int
    returned_30d: int
    refund_issued: int  # Deliberately future information: never a feature.

    @property
    def label_ready_on(self):
        # Conservative: wait the entire window even for early positive labels.
        return self.ordered_on + timedelta(days=30)


def binary(value):
    return type(value) is int and value in (0, 1)


def validate_orders(orders):
    seen = set()
    for row in orders:
        if not isinstance(row, Order) or type(row.ordered_on) is not date:
            raise ValueError("Expected Order with a calendar date")
        if (not isinstance(row.order_id, str) or not isinstance(row.customer_id, str)
                or not row.order_id.strip() or not row.customer_id.strip() or row.order_id in seen):
            raise ValueError("Order IDs must be unique; IDs must not be blank")
        if not binary(row.returned_30d) or not binary(row.refund_issued):
            raise ValueError("Labels must be integer 0 or 1")
        if type(row.items_at_purchase) is not int or row.items_at_purchase < 1:
            raise ValueError("items_at_purchase must be a positive integer")
        if type(row.prior_orders_at_purchase) is not int or row.prior_orders_at_purchase < 0:
            raise ValueError("prior_orders_at_purchase must be a nonnegative integer")
        seen.add(row.order_id)


def split_orders(orders, train_cutoff=TRAIN_CUTOFF,
                 validation_cutoff=VALIDATION_CUTOFF, test_as_of=TEST_AS_OF):
    """Keep labels available at each decision date; do not backfill immature rows."""
    cutoffs = (train_cutoff, validation_cutoff, test_as_of)
    if any(type(value) is not date for value in cutoffs) or not train_cutoff < validation_cutoff < test_as_of:
        raise ValueError("Cutoffs must be increasing calendar dates")
    validate_orders(orders)
    folds = {"train": [], "validation": [], "test": []}
    excluded = []
    for row in sorted(orders, key=lambda item: (item.ordered_on, item.order_id)):
        if row.ordered_on < train_cutoff:
            fold, available_on = "train", train_cutoff
        elif row.ordered_on < validation_cutoff:
            fold, available_on = "validation", validation_cutoff
        elif row.ordered_on < test_as_of:
            fold, available_on = "test", test_as_of
        else:
            excluded.append({"id": row.order_id, "reason": "outside observation period"})
            continue
        if row.label_ready_on > available_on:
            excluded.append({"id": row.order_id, "reason": f"label unavailable at {fold} cutoff"})
        else:
            folds[fold].append(row)
    return folds, excluded


def feature_rows(orders):
    validate_orders(orders)
    return [{name: getattr(row, name) for name in FEATURES} for row in orders]


def fit_majority(train):
    validate_orders(train)
    if not train:
        raise ValueError("Training data must not be empty")
    # Tie policy is specified in advance, not selected using validation or test.
    return int(sum(row.returned_30d for row in train) > len(train) / 2)


def metrics(actual, predicted):
    if not actual or len(actual) != len(predicted):
        raise ValueError("Nonempty actual and predicted lists must have equal lengths")
    if not all(binary(value) for value in [*actual, *predicted]):
        raise ValueError("Expected integer binary labels")
    tp = sum(y == 1 and p == 1 for y, p in zip(actual, predicted))
    tn = sum(y == 0 and p == 0 for y, p in zip(actual, predicted))
    fp = sum(y == 0 and p == 1 for y, p in zip(actual, predicted))
    fn = sum(y == 1 and p == 0 for y, p in zip(actual, predicted))
    return {
        "n": len(actual), "tp": tp, "tn": tn, "fp": fp, "fn": fn,
        "accuracy": (tp + tn) / len(actual),
        "precision": tp / (tp + fp) if tp + fp else None,
        "recall": tp / (tp + fn) if tp + fn else None,
        "positive_rate": sum(actual) / len(actual),
    }


def demo_orders():
    schedule = [(date(2026, 1, day), int(day >= 7)) for day in range(1, 9)]
    schedule += [(date(2026, 3, day), label) for day, label in enumerate([0, 1, 1, 0], 1)]
    schedule += [(date(2026, 6, day), label) for day, label in enumerate([0, 1, 0, 1], 1)]
    schedule += [(date(2026, month, 20), 1) for month in (2, 5, 7)]
    return [Order(f"order-{index + 1:02}", f"customer-{index % 3}", ordered_on,
                  1 + index % 4, index // 3, label, label)
            for index, (ordered_on, label) in enumerate(sorted(schedule))]


def build_report(orders=None, include_test=False):
    orders = demo_orders() if orders is None else orders
    folds, excluded = split_orders(orders)
    baseline = fit_majority(folds["train"])
    result = {
        "task": "Predict a return within 30 days at purchase time",
        "features": list(FEATURES), "baseline_label": baseline,
        "cutoffs": {"train": str(TRAIN_CUTOFF), "validation": str(VALIDATION_CUTOFF),
                    "test_as_of": str(TEST_AS_OF)},
        "split_ids": {key: [row.order_id for row in rows] for key, rows in folds.items()},
        "excluded": excluded, "test_metrics_revealed": include_test,
    }
    for name in ("train", "validation", "test") if include_test else ("train", "validation"):
        actual = [row.returned_30d for row in folds[name]]
        result[name] = metrics(actual, [baseline] * len(actual))
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--include-test", action="store_true",
                        help="Reveal final test metrics only after freezing the approach")
    args = parser.parse_args()
    print(json.dumps(build_report(include_test=args.include_test), indent=2, allow_nan=False))
