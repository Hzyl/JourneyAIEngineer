"""Real tiny-CPU behavior tests; missing optional torch is reported as a skip.

Run with a Python environment containing PyTorch, for example the existing
.build/math-verification/Scripts/python.exe. No dependency is installed by tests.
"""
import contextlib
import importlib.util
import io
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
SAMPLES = ROOT / "samples" / "pytorch-text-bridge"
LESSONS = {
    "pytorch-core-1": "tensor_shapes.py",
    "pytorch-core-4": "autograd_bridge.py",
    "training-1": "train_classifier.py",
    "vision-nlp-3": "masked_pooling.py",
    "vision-nlp-4": "attention_mask.py",
}


def load(name):
    spec = importlib.util.spec_from_file_location(name, SAMPLES / (name + ".py"))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class BridgeBehaviorTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        try:
            import torch
        except ImportError:
            raise unittest.SkipTest("PyTorch not installed; run this suite in the documented CPU environment")
        cls.torch = torch
        torch.set_num_threads(1)
        cls.shapes = load("tensor_shapes")
        cls.pooling = load("masked_pooling")
        cls.autograd = load("autograd_bridge")
        cls.training = load("train_classifier")
        cls.attention = load("attention_mask")
        cls.model, cls.report = cls.training.run()

    def test_ids_validate_axes_dtype_range_and_empty_sentences(self):
        torch = self.torch
        self.shapes.validate_ids(torch.tensor([[1, 2, 0]]), 3)
        invalid = [torch.tensor([1, 2]), torch.tensor([[1.0, 2.0]]),
                   torch.tensor([[3]]), torch.tensor([[-1]]), torch.tensor([[0, 0]]),
                   torch.empty(0, 2, dtype=torch.long)]
        for ids in invalid:
            with self.subTest(ids=ids):
                with self.assertRaises(ValueError):
                    self.shapes.validate_ids(ids, 3)

    def test_masked_mean_matches_hand_calculation_and_padding_is_inert(self):
        torch = self.torch
        vectors = torch.tensor([[[2.0, 0.0], [0.0, 4.0], [900.0, -900.0]]])
        valid = torch.tensor([[True, True, False]])
        result = self.pooling.masked_mean(vectors, valid)
        torch.testing.assert_close(result, torch.tensor([[1.0, 2.0]]))
        extra = torch.cat([vectors, torch.full((1, 2, 2), 10000.0)], dim=1)
        mask = torch.cat([valid, torch.zeros(1, 2, dtype=torch.bool)], dim=1)
        torch.testing.assert_close(self.pooling.masked_mean(extra, mask), result)

    def test_pooling_rejects_empty_and_misaligned_or_non_boolean_masks(self):
        torch = self.torch
        vectors = torch.ones(2, 3, 4)
        for mask in (torch.ones(2, 4, dtype=torch.bool), torch.ones(2, 3),
                     torch.zeros(2, 3, dtype=torch.bool)):
            with self.subTest(shape=mask.shape, dtype=mask.dtype):
                with self.assertRaises(ValueError):
                    self.pooling.masked_mean(vectors, mask)

    def test_pooling_gradients_match_token_frequencies_and_ignore_pad(self):
        torch = self.torch
        embedding = torch.nn.Embedding(3, 2, padding_idx=0)
        ids = torch.tensor([[1, 2, 0], [1, 0, 0]])
        self.pooling.masked_mean(embedding(ids), ids.ne(0)).sum().backward()
        torch.testing.assert_close(embedding.weight.grad,
                                   torch.tensor([[0.0, 0.0], [1.5, 1.5], [0.5, 0.5]]))

    def test_autograd_accumulates_then_updates_once_after_reset(self):
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            w, b = self.autograd.demo()
        self.torch.testing.assert_close(w, self.torch.tensor([0.3, 0.1]))
        self.torch.testing.assert_close(b, self.torch.tensor(0.6))
        self.assertIn("accumulated [-2.0, -4.0] -2.0", output.getvalue())
        self.assertIn("loss 0.25 -> 0.01", output.getvalue())

    def test_autograd_exercise_matches_independent_hand_derivative(self):
        torch = self.torch
        x = torch.tensor([2.0, 1.0])
        w = torch.tensor([0.2, -0.1], requires_grad=True)
        b = torch.tensor(0.5, requires_grad=True)
        loss = (x @ w + b - 1.0).square()
        loss.backward()
        torch.testing.assert_close(w.grad, torch.tensor([-0.8, -0.4]))
        torch.testing.assert_close(b.grad, torch.tensor(-0.4))
        with torch.no_grad():
            w -= 0.1 * w.grad
            b -= 0.1 * b.grad
        self.assertAlmostEqual(float((x @ w + b - 1.0).square().detach()), 0.0016, places=6)

    def test_training_learns_tiny_fixture_but_fails_order_counterexample(self):
        self.assertLess(self.report["final_train_loss"], self.report["initial_train_loss"] / 5)
        self.assertEqual(self.report["validation_count"], 4)
        self.assertEqual(self.report["confusion_rows_actual"], [[2, 0], [0, 2]])
        self.assertEqual(self.report["order_pair_correct"], 1)
        self.assertEqual(len(set(self.report["order_pair_predictions"])), 1)

    def test_eval_is_deterministic_padding_invariant_and_has_no_graph(self):
        torch = self.torch
        self.model.eval()
        ids = self.training.encode(["bài tốt", "bài tệ"])
        with torch.no_grad():
            first = self.model(ids)
            second = self.model(ids)
            padded = self.model(torch.nn.functional.pad(ids, (0, 5)))
        torch.testing.assert_close(first, second, rtol=0, atol=0)
        torch.testing.assert_close(first, padded)
        self.assertFalse(first.requires_grad)
        self.assertEqual(tuple(first.shape), (2, 2))

    def test_classifier_gradient_reaches_embedding_but_not_padding(self):
        torch = self.torch
        model = self.training.TextClassifier()
        ids = self.training.encode(["bài tốt", "bài tệ"])
        loss = torch.nn.functional.cross_entropy(model(ids), torch.tensor([1, 0]))
        loss.backward()
        self.assertGreater(float(model.embedding.weight.grad.abs().sum()), 0.0)
        torch.testing.assert_close(model.embedding.weight.grad[0], torch.zeros(8))

    def test_encode_unknown_does_not_expand_training_vocabulary(self):
        before = dict(self.training.VOCAB)
        self.assertEqual(self.training.encode(["unseen"])[0, 0].item(), 1)
        self.assertEqual(self.training.VOCAB, before)
        for texts in ([], [" "], ["a b c d e"]):
            with self.subTest(texts=texts):
                with self.assertRaises(ValueError):
                    self.training.encode(texts)

    def test_attention_causality_and_padding_against_hand_outputs(self):
        torch = self.torch
        q = torch.zeros(1, 3, 2)
        valid = torch.tensor([[True, True, False]])
        value = torch.tensor([[[1.0, 0.0], [9.0, 0.0], [999.0, 999.0]]])
        causal, weights = self.attention.attention(q, q, value, valid)
        both, _ = self.attention.attention(q, q, value, valid, causal=False)
        torch.testing.assert_close(causal[0, :, 0], torch.tensor([1.0, 5.0, 0.0]))
        torch.testing.assert_close(both[0, :, 0], torch.tensor([5.0, 5.0, 0.0]))
        self.assertEqual(float(weights[:, :, 2].abs().sum()), 0.0)
        self.assertEqual(float(weights[:, 2, :].abs().sum()), 0.0)

    def test_attention_matches_pytorch_and_gradients_are_finite(self):
        torch = self.torch
        torch.manual_seed(9)
        q, k, v = [torch.randn(2, 3, 4, requires_grad=True) for _ in range(3)]
        valid = torch.tensor([[True, True, False], [True, True, True]])
        actual, _ = self.attention.attention(q, k, v, valid)
        allowed = valid.unsqueeze(1) & torch.ones(3, 3, dtype=torch.bool).tril()
        expected = torch.nn.functional.scaled_dot_product_attention(q, k, v,
                                                                    attn_mask=allowed, dropout_p=0.0)
        expected = expected * valid.unsqueeze(-1)
        torch.testing.assert_close(actual, expected, atol=1e-6, rtol=1e-5)
        actual.square().sum().backward()
        for item in (q, k, v):
            self.assertTrue(bool(torch.isfinite(item.grad).all()))
            self.assertGreater(float(item.grad.abs().sum()), 0.0)

    def test_attention_rejects_all_pad_left_padding_and_wrong_shape(self):
        torch = self.torch
        q = torch.zeros(1, 3, 2)
        invalid = [torch.tensor([[False, False, False]]), torch.tensor([[False, True, True]]),
                   torch.tensor([[True, False, True]]), torch.ones(1, 4, dtype=torch.bool)]
        for valid in invalid:
            with self.subTest(valid=valid):
                with self.assertRaises(ValueError):
                    self.attention.attention(q, q, q, valid)


class LessonSourceTests(unittest.TestCase):
    def test_embedded_code_matches_reviewable_sample_files(self):
        try:
            import yaml
        except ImportError:
            self.skipTest("Run source checks in the repository Python environment with PyYAML")
        for suffix, filename in LESSONS.items():
            with self.subTest(lesson=suffix):
                path = ROOT / "content" / "lessons" / ("phase-04-deep-learning-" + suffix + ".md")
                data = yaml.safe_load(path.read_text(encoding="utf-8").split("---", 2)[1])
                self.assertEqual(data["code_examples"][0]["code"], (SAMPLES / filename).read_text(encoding="utf-8"))
                for language in ("vi", "en"):
                    self.assertIn("T13", data["concept_notes_" + language])
                    self.assertIn("M + H", data["concept_notes_" + language])
                    self.assertTrue(data["practice_plan"][language]["checkpoint"])
                compile(data["code_examples"][0]["code"], filename, "exec")


if __name__ == "__main__":
    unittest.main(verbosity=2)
