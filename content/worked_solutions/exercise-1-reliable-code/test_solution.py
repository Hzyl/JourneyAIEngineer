import unittest

from tags import add_tag


class TagTests(unittest.TestCase):
    def test_calls_are_independent(self):
        first = add_tag("python")
        second = add_tag("sql")
        self.assertEqual(first, ["python"])
        self.assertEqual(second, ["sql"])
        self.assertIsNot(first, second)

    def test_existing_list_is_not_mutated(self):
        original = ["python"]
        self.assertEqual(add_tag("sql", original), ["python", "sql"])
        self.assertEqual(original, ["python"])

    def test_empty_list_is_not_mutated(self):
        original = []
        self.assertEqual(add_tag("python", original), ["python"])
        self.assertEqual(original, [])

    def test_trim_and_duplicate(self):
        self.assertEqual(add_tag(" python ", ["python"]), ["python"])

    def test_bad_input(self):
        for tag in (None, 42, "", "  "):
            with self.subTest(tag=tag), self.assertRaises(ValueError):
                add_tag(tag)
        for tags in ("python", [None], [""]):
            with self.subTest(tags=tags), self.assertRaises(ValueError):
                add_tag("python", tags)


if __name__ == "__main__":
    unittest.main()
