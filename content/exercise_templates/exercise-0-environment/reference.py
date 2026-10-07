import sys


def inspect_environment():
    return {
        "major": sys.version_info.major,
        "minor": sys.version_info.minor,
        "executable": sys.executable,
        "in_venv": sys.prefix != sys.base_prefix,
    }


if __name__ == "__main__":
    print(inspect_environment())
