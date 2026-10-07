import sys
import unittest
from unittest.mock import patch

from starter import inspect_environment


class EnvironmentTests(unittest.TestCase):
    def test_reports_the_running_interpreter(self):
        result = inspect_environment()
        self.assertEqual(result["major"], sys.version_info.major)
        self.assertEqual(result["minor"], sys.version_info.minor)
        self.assertEqual(result["executable"], sys.executable)
        self.assertIs(result["in_venv"], sys.prefix != sys.base_prefix)

    def test_virtual_environment_is_detected_without_hardcoding(self):
        with patch.object(sys, "prefix", "/project/.venv"), patch.object(sys, "base_prefix", "/python"):
            self.assertIs(inspect_environment()["in_venv"], True)

    def test_global_interpreter_is_not_a_virtual_environment(self):
        with patch.object(sys, "prefix", "/python"), patch.object(sys, "base_prefix", "/python"):
            self.assertIs(inspect_environment()["in_venv"], False)


if __name__ == "__main__":
    unittest.main()
