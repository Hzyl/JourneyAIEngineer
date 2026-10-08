"""Intentionally faulty example. Run this to reproduce the shared default bug."""
import logging

logging.basicConfig(level=logging.DEBUG, format="%(message)s")


def add_tag(tag, tags=[]):
    logging.debug("before: id=%s tags=%r", id(tags), tags)
    tags.append(tag)
    logging.debug("after:  id=%s tags=%r", id(tags), tags)
    return tags


if __name__ == "__main__":
    first = add_tag("python")
    second = add_tag("sql")
    print("Expected first=['python'], second=['sql']")
    print("Actual:", first, second)
