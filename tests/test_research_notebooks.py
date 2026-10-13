"""Execute notebook setup/baseline/export with local HTTP fixtures, never install models."""
import importlib.util
import io
import json
import platform
from pathlib import Path
import subprocess
import sys
import tempfile
from types import ModuleType, SimpleNamespace
from urllib.error import HTTPError
import urllib.request

import pytest

ROOT = Path(__file__).resolve().parents[1]
SAMPLE = ROOT / "samples" / "vi-document-assistant"
NOTEBOOKS = sorted((ROOT / "notebooks").glob("lab-*.ipynb"))
COMMIT = "a" * 40


@pytest.fixture
def hosted_runtime(monkeypatch, tmp_path):
    requests, downloads = [], []
    original_is_dir = Path.is_dir
    original_find_spec = importlib.util.find_spec
    monkeypatch.setattr(Path, "is_dir", lambda path: True if str(path).replace("\\", "/") == "/content"
                        else original_is_dir(path))
    monkeypatch.setattr(importlib.util, "find_spec", lambda name: object() if name == "google.colab"
                        else original_find_spec(name))
    work = tmp_path / "runtime"
    work.mkdir()
    original_mkdtemp = tempfile.mkdtemp
    monkeypatch.setattr(tempfile, "mkdtemp", lambda *args, **kwargs: str(work)
                        if kwargs.get("prefix") == "journey-labs-"
                        else original_mkdtemp(*args, **kwargs))
    monkeypatch.setattr(platform, "platform", lambda: "Synthetic hosted runtime for notebook tests")
    google, colab = ModuleType("google"), ModuleType("google.colab")
    colab.files = SimpleNamespace(download=lambda path: downloads.append(Path(path)))
    google.colab = colab
    monkeypatch.setitem(sys.modules, "google", google)
    monkeypatch.setitem(sys.modules, "google.colab", colab)
    files = {"samples/vi-document-assistant/" + path.relative_to(SAMPLE).as_posix(): path
             for path in (SAMPLE / "research_lab").rglob("*") if path.suffix in {".py", ".json"}}

    def urlopen(request, timeout):
        assert timeout == 30
        url = request.full_url
        requests.append(url)
        if url.endswith("/commits/main"):
            return io.BytesIO(json.dumps({"sha": COMMIT}).encode())
        if url.endswith(f"/git/trees/{COMMIT}?recursive=1"):
            return io.BytesIO(json.dumps({"tree": [{"type": "blob", "path": path} for path in files]}).encode())
        prefix = f"https://raw.githubusercontent.com/Hzyl/JourneyAIEngineer/{COMMIT}/"
        assert url.startswith(prefix), "Every module must be fetched at the resolved commit"
        return io.BytesIO(files[url.removeprefix(prefix)].read_bytes())

    monkeypatch.setattr(urllib.request, "urlopen", urlopen)
    monkeypatch.setattr(subprocess, "run", lambda *args, **kwargs: pytest.fail("No install/process in notebook checks"))
    original_modules = {name: module for name, module in sys.modules.items()
                        if name == "research_lab" or name.startswith("research_lab.")}
    original_path = sys.path[:]
    try:
        yield SimpleNamespace(requests=requests, downloads=downloads, work=work)
    finally:
        sys.path[:] = original_path
        for name in list(sys.modules):
            if name == "research_lab" or name.startswith("research_lab."):
                del sys.modules[name]
        sys.modules.update(original_modules)


@pytest.mark.parametrize("path", NOTEBOOKS, ids=lambda path: path.stem)
def test_notebook_baseline_and_export_execute(path, hosted_runtime):
    notebook = json.loads(path.read_text(encoding="utf-8"))
    assert notebook["nbformat"] == 4
    namespace = {}
    skipped = []
    for index, cell in enumerate(notebook["cells"]):
        if cell["cell_type"] != "code":
            continue
        assert cell["outputs"] == [] and cell["execution_count"] is None
        source = cell["source"]
        if "subprocess.run" in source or "ColabSentenceTransformer" in source:
            skipped.append(index)
            continue
        exec(compile(source, f"{path.name}:{index}", "exec"), namespace)
    assert len(skipped) == (2 if path.name.startswith("lab-a-") else 0)
    assert len(hosted_runtime.downloads) == 1
    report = json.loads(hosted_runtime.downloads[0].read_text(encoding="utf-8"))
    assert report["notebook_provenance"]["commit"] == COMMIT
    assert report["notebook_provenance"]["runtime"] == "Google Colab"
    assert len(report) > 1
    assert sum(url.endswith("/commits/main") for url in hosted_runtime.requests) == 1


def setup_code():
    notebook = json.loads(NOTEBOOKS[0].read_text(encoding="utf-8"))
    return next(cell["source"] for cell in notebook["cells"] if cell["cell_type"] == "code")


def test_local_runtime_stops_before_network_or_install(monkeypatch):
    monkeypatch.setattr(importlib.util, "find_spec", lambda name: None)
    monkeypatch.setattr(urllib.request, "urlopen", lambda *args, **kwargs: pytest.fail("Unexpected network"))
    with pytest.raises(RuntimeError, match="Google-hosted"):
        exec(setup_code(), {})


def test_github_failure_is_actionable_and_does_not_import_lab(hosted_runtime, monkeypatch):
    def fail(request, timeout):
        raise HTTPError(request.full_url, 404, "Not published", {}, None)
    monkeypatch.setattr(urllib.request, "urlopen", fail)
    with pytest.raises(RuntimeError, match="published labs") as error:
        exec(setup_code(), {})
    assert isinstance(error.value.__cause__, HTTPError)
    assert list(hosted_runtime.work.iterdir()) == []


def test_final_test_evaluation_requires_separate_opt_in(hosted_runtime):
    notebook = json.loads(NOTEBOOKS[0].read_text(encoding="utf-8"))
    namespace = {}
    for cell in notebook["cells"]:
        if cell["cell_type"] != "code":
            continue
        source = cell["source"]
        if "subprocess.run" in source or "ColabSentenceTransformer" in source:
            continue
        if "RUN_FINAL_TEST" in source:
            exec(source, namespace)
            assert "test" not in namespace["report"]["methods"]["lexical"]
            assert "final_test_evaluation" not in namespace["report"]
            exec(source.replace("RUN_FINAL_TEST = False", "RUN_FINAL_TEST = True"), namespace)
            final_test = namespace["report"]["final_test_evaluation"]
            assert "dev" not in final_test["methods"]["lexical"]
            assert final_test["methods"]["lexical"]["test"]["count"] > 0
            break
        exec(source, namespace)
    else:
        pytest.fail("Missing separate final test cell")


def test_rerunning_setup_and_baseline_clear_stale_model(hosted_runtime):
    namespace = {"backend": object(), "report": {"old": True}, "lab_a": object()}
    exec(setup_code(), namespace)
    assert "backend" not in namespace and "report" not in namespace and "lab_a" not in namespace
    notebook = json.loads(NOTEBOOKS[0].read_text(encoding="utf-8"))
    summary = next(cell["source"] for cell in notebook["cells"]
                   if cell["cell_type"] == "code" and cell["source"].startswith("def show_report"))
    baseline = next(cell["source"] for cell in notebook["cells"]
                    if cell["cell_type"] == "code" and "report = lab_a.run()" in cell["source"])
    exec(summary, namespace)
    namespace["backend"] = object()
    exec(baseline, namespace)
    assert namespace["backend"] is None
    assert set(namespace["report"]["methods"]) == {"lexical"}
    final_cell = next(cell["source"] for cell in notebook["cells"]
                      if cell["cell_type"] == "code" and "RUN_FINAL_TEST" in cell["source"])
    exec(final_cell.replace("RUN_FINAL_TEST = False", "RUN_FINAL_TEST = True"), namespace)
    assert set(namespace["report"]["final_test_evaluation"]["methods"]) == {"lexical"}


def test_notebooks_have_safe_unique_paths_and_no_saved_outputs():
    assert len(NOTEBOOKS) == 3
    for path in NOTEBOOKS:
        notebook = json.loads(path.read_text(encoding="utf-8"))
        ids = [cell["id"] for cell in notebook["cells"]]
        assert len(ids) == len(set(ids))
        for cell in notebook["cells"]:
            if cell["cell_type"] == "code":
                compile(cell["source"], path.name, "exec")
                assert cell["outputs"] == []
