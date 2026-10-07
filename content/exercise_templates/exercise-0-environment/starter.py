"""Report the interpreter actually executing this file. Use only the standard library."""


def inspect_environment():
    """Return major, minor, executable and in_venv for the current Python process."""
    raise NotImplementedError("Inspect sys.version_info, sys.executable and the two prefixes")


if __name__ == "__main__":
    print(inspect_environment())
