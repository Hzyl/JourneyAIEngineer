"""Regression checks for the files included in the portable Windows bundle."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PACKAGING = ROOT / "packaging"


def test_release_script_copies_gui_executable_and_onboarding() -> None:
    script = (ROOT / "scripts" / "package_release.ps1").read_text(encoding="utf-8")
    start_here = PACKAGING / "START-HERE.txt"

    assert 'JourneyAIEngineer.exe' in script
    assert start_here.is_file()


def test_release_script_copies_portable_onboarding_files() -> None:
    script = (ROOT / "scripts" / "package_release.ps1").read_text(encoding="utf-8")

    assert 'packaging\\START-HERE.txt' in script
    assert 'SECURITY.md' in script
    assert 'CONTRIBUTING.md' in script
    assert '"QUICKSTART-WINDOWS.md", "PUBLIC-BETA.md", "ARCHITECTURE.md"' in script
    assert 'content\\study-playbook.md' in script


def test_portable_onboarding_explains_local_data_boundary() -> None:
    start_here = (PACKAGING / "START-HERE.txt").read_text(encoding="utf-8")

    assert "Double-click JourneyAIEngineer.exe" in start_here
    assert "%LOCALAPPDATA%\\JourneyAIEngineer" in start_here
    assert "does not publish to GitHub" in start_here
