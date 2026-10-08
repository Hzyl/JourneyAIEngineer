from apps.api.catalog_version import catalog_metadata


def test_downloadable_dependencies_change_fingerprint_but_line_endings_do_not(tmp_path):
    requirements = tmp_path / "requirements.txt"
    requirements.write_bytes(b"numpy\nmatplotlib\n")
    original = catalog_metadata(tmp_path, "0.1.2")
    requirements.write_bytes(b"numpy\r\nmatplotlib\r\n")
    assert catalog_metadata(tmp_path, "0.1.2") == original
    requirements.write_bytes(b"numpy\nmatplotlib\ntorch\n")
    assert catalog_metadata(tmp_path, "0.1.2") != original
