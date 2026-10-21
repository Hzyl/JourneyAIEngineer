"""Build small Colab notebooks that reuse the versioned research lab modules."""
import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
NAMES = {
    "a": "lab-a-evidence-retrieval",
    "b": "lab-b-workflow-agent",
    "c": "lab-c-security-regression",
}

BOOTSTRAP = '''# Only run in a Google-hosted Colab runtime, not a local runtime.
import importlib.util
import json
import re
import sys
import tempfile
from pathlib import Path, PurePosixPath
from urllib.request import Request, urlopen

try:
    in_colab = importlib.util.find_spec("google.colab") is not None
except ModuleNotFoundError:
    in_colab = False
if not in_colab or not Path("/content").is_dir():
    raise RuntimeError("Use a Google-hosted Colab runtime. Do not install on your PC.")

# Clear previous-run objects so a new source revision cannot reuse an old model/report.
for previous_state in ("backend", "report", "lab_a", "lab_b", "lab_c"):
    globals().pop(previous_state, None)

REPOSITORY = "Hzyl/JourneyAIEngineer"
REVISION = "main"  # Replace with a saved 40-character commit SHA to reproduce a run.

def fetch(url, limit=5_000_000):
    request = Request(url, headers={"User-Agent": "JourneyAIEngineer-Colab"})
    with urlopen(request, timeout=30) as response:
        payload = response.read(limit + 1)
    if len(payload) > limit:
        raise ValueError("Unexpectedly large download")
    return payload

if REVISION != "main" and not re.fullmatch(r"[0-9a-f]{40}", REVISION):
    raise ValueError("REVISION must be main or a full commit SHA")
try:
    COMMIT = (json.loads(fetch(f"https://api.github.com/repos/{REPOSITORY}/commits/main"))["sha"]
              if REVISION == "main" else REVISION)
    if not re.fullmatch(r"[0-9a-f]{40}", COMMIT):
        raise ValueError("Invalid commit returned by GitHub")
    tree = json.loads(fetch(f"https://api.github.com/repos/{REPOSITORY}/git/trees/{COMMIT}?recursive=1"))
    if tree.get("truncated"):
        raise ValueError("Incomplete GitHub tree")
    prefix = "samples/vi-document-assistant/"
    paths = [item["path"] for item in tree["tree"]
             if item["type"] == "blob" and item["path"].startswith(prefix + "research_lab/")
             and PurePosixPath(item["path"]).suffix in {".py", ".json"}]
    if not paths or len(paths) > 50:
        raise ValueError("Research labs are missing from this revision; publish them first.")
    LAB_ROOT = Path(tempfile.mkdtemp(prefix="journey-labs-"))
    for path in paths:
        relative = PurePosixPath(path.removeprefix(prefix))
        if relative.is_absolute() or ".." in relative.parts:
            raise ValueError("Unsafe file path")
        target = LAB_ROOT.joinpath(*relative.parts)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(fetch(f"https://raw.githubusercontent.com/{REPOSITORY}/{COMMIT}/{path}"))
except Exception as error:
    raise RuntimeError("Could not load the published labs. Check the revision/network; "
                       "GitHub may rate-limit requests. Retry later. No model was loaded.") from error

# Rerunning this cell must not keep imports from an earlier repository revision.
for module in list(sys.modules):
    if module == "research_lab" or module.startswith("research_lab."):
        del sys.modules[module]
sys.path.insert(0, str(LAB_ROOT))
print("Repository commit:", COMMIT)
print("Files loaded:", len(paths))
'''

EXPORT = '''# Save the exact source revision and report; no Drive mount or API key needed.
from datetime import datetime, timezone
from google.colab import files

report["notebook_provenance"] = {
    "repository": REPOSITORY, "commit": COMMIT,
    "created_at": datetime.now(timezone.utc).isoformat(),
    "python": sys.version, "runtime": "Google Colab",
}
destination = LAB_ROOT / "REPORT_NAME.json"
destination.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
files.download(str(destination))
'''

SUMMARY = '''def show_report(report):
    """Display an overview; export still contains every case and provenance field."""
    print("Lab", report["lab"])
    if report["lab"] == "A":
        for method, result in report["methods"].items():
            for split in ("dev", "test"):
                if split not in result:
                    continue
                score = result[split]
                print(method, split, "cases =", score["count"])
                print("retrieval =", score["retrieval"])
                print("decision accuracy =", score["decision_accuracy"])
                print("failures =", score["failures"])
    elif report["lab"] == "B":
        for method, result in report["methods"].items():
            print(method, "success =", result["task_success_rate"],
                  "mean calls =", result["mean_calls"])
            for case in result["cases"]:
                print(" ", case["id"], case["stop_reason"], "calls =", case["calls"])
        print("checkpoint =", report["checkpoint"])
        print("failure probes =", [(case["id"], case["passed"])
                                   for case in report["failure_probes"]])
    else:
        for variant in ("before", "after"):
            result = report[variant]
            print(variant, result["passed"], "/", result["total"])
            print("failures =", [case["id"] for case in result["cases"] if not case["passed"]])
        print("regression =", report["regression"])
    print("Limits:", *report.get("limitations", []), sep="\\n- ")
'''

def markdown(text):
    return {"cell_type": "markdown", "metadata": {}, "source": text}

def code(text):
    return {"cell_type": "code", "metadata": {}, "source": text,
            "execution_count": None, "outputs": []}

INTRO = """**VI:** Chọn **Connect → Connect to a hosted runtime** (CPU là đủ), rồi chạy từng ô từ trên xuống. Không chọn *local runtime*. Lab dùng dữ liệu giả công khai; không cần khóa API hay kết nối Supabase. Bạn có thể lưu một bản notebook riêng rồi sửa mã để thử nghiệm. Colab có giới hạn tài nguyên và có thể xóa runtime khi không hoạt động, nên hãy tải báo cáo cuối bài.

**EN:** Connect to a **Google-hosted CPU runtime**, then run cells in order. Do not select a local runtime. The lab uses public synthetic data, without API keys or Supabase. Save a personal copy to edit and experiment. Colab has resource limits and may delete idle runtimes, so download the final report.

Nguồn / Sources: [Colab FAQ](https://research.google.com/colaboratory/faq.html). Ô thiết lập tải các module nhỏ từ một commit GitHub cố định cho mỗi lần chạy. / Setup downloads small modules from one GitHub commit per run. The public repository must contain this notebook and the lab files; before publication, the GitHub links will not work.
"""

def lab_cells(lab):
    if lab == "a":
        return [markdown("""# Lab A · Tìm tài liệu có bằng chứng / Evidence-based retrieval

So sánh tìm kiếm từ khóa và embedding trên **cùng 12 tài liệu giả, 30 câu hỏi** (20 có đáp án, 5 thiếu bằng chứng, 5 mơ hồ). Giữ nguyên tập test; chỉ dùng dev để lựa chọn cấu hình. Lab đo retrieval, chưa gọi LLM để sinh câu trả lời.

Compare lexical and embedding retrieval on the **same 12 synthetic documents and 30 questions** (20 answerable, 5 unanswerable, 5 ambiguous). Tune on dev only; keep test fixed. This lab measures retrieval, without an LLM answer generator.
"""), markdown(INTRO), code(BOOTSTRAP), markdown("""## 1. Chạy baseline / Run the baseline

Đọc cả các ca sai, không chỉ điểm tổng. Kiểm tra mã tài liệu, phiên bản và dòng trích dẫn. Nguồn tồn tại chưa có nghĩa là nguồn hỗ trợ kết luận.

Read failures as well as summary scores. Check document ID, version and source line. Citation existence does not establish semantic support.
"""), code('from research_lab import lab_a\nreport = lab_a.run()\nprint(json.dumps(report, ensure_ascii=False, indent=2))\n'), markdown("""## 2. So sánh với embedding thật / Compare real embeddings

Hai ô tiếp theo cài thư viện và tải model **vào máy chủ Colab**. Chạy CPU, không cần GPU hay API trả phí. Nếu chỉ muốn xem baseline, bỏ qua hai ô này và xuất báo cáo. Không diễn giải `cosine similarity` như xác suất câu trả lời đúng.

The next two cells install libraries and download the model **on Colab's server**. CPU is sufficient; no GPU or paid API is required. Skip both cells to export only the baseline. Cosine similarity is not the probability that an answer is correct.

Model: [paraphrase-multilingual-MiniLM-L12-v2](https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2), Apache-2.0, revision `e8f8c211226b894fcb81acc59f3b34ba3efd5f42`. Model card: 384 chiều / dimensions, mean pooling, tối đa / maximum 128 tokens. Đây là giới hạn của cấu hình model, không phải 128 từ. / Tokens are not words.
"""), code('import subprocess\nif not in_colab or not Path("/content").is_dir():\n    raise RuntimeError("Use the Google-hosted runtime first")\nsubprocess.run([sys.executable, "-m", "pip", "install", "--quiet",\n                "sentence-transformers==5.1.2", "transformers==4.57.1"], check=True)\n'), code('from research_lab.embeddings import ColabSentenceTransformer\nbackend = ColabSentenceTransformer()\nreport = lab_a.run(embedding_backend=backend)\nprint(json.dumps(report, ensure_ascii=False, indent=2))\n'), markdown("""## 3. Giải thích kết quả / Explain the result

- Chọn tối đa hai ca sai và lần về tài liệu gốc: lỗi do cách chia đoạn, từ khóa, ngữ nghĩa hay câu hỏi thiếu rõ ràng? Nếu chưa có ca sai, tạo câu hỏi dev khó hơn; không sửa tập test để cải thiện điểm.
- So sánh hai phương pháp riêng trên dev và test. Đừng giả định embedding luôn tốt hơn từ khóa.
- Giữ nguyên test khi đổi cấu hình; ghi lại thay đổi, revision và thời gian. Chỉ thêm bước sinh câu trả lời như một thí nghiệm riêng có chấm groundedness.

Pick up to two failures and trace them to the source. If none fail, author harder dev questions; do not change test cases to improve the score. Separate chunking, lexical, semantic and ambiguous-question failures. Compare dev and test separately; embeddings need not win. Keep test fixed, record configuration/revision/timing, and evaluate any later answer-generation experiment separately for groundedness.
""")]
    title, purpose, exercise = {
        "b": ("Workflow và agent / Workflow and agent", "So sánh workflow cố định và agent theo kịch bản trên cùng tác vụ. Các quyết định được lập trình sẵn, không có LLM. / Compare a fixed workflow with a scripted agent on the same task. Decisions are programmed, not produced by an LLM.", "Đọc trace và stop_reason: công cụ nào đã được gọi, quyền nào đã được kiểm tra, khi nào dừng? Thử trường hợp không có kết quả, sai schema, lỗi công cụ, lặp query và hết thời gian. Kiểm tra checkpoint có thể khôi phục gì; approval giả không đại diện cho xác thực người dùng thật. / Inspect traces and stop reasons for no results, invalid schema, tool failure, repeated queries and timeout. Check what a checkpoint restores; fake approval is not real user authentication."),
        "c": ("Phân quyền và regression / Authorization and regression", "Dùng hai người dùng giả có quyền đọc khác nhau. So sánh trước/sau trên cùng fixture, đồng thời kiểm tra truy cập bị chặn trước khi đọc dữ liệu. / Use two synthetic users with different read permissions. Compare before/after on the same fixture and check that access is denied before reading data.", "Tìm ca rò rỉ dữ liệu trong bản cố ý sai, rồi xem bản sửa chặn ở đâu. Đọc hash dữ liệu, cấu hình và các ca hồi quy. Fixture prompt injection chỉ kiểm tra ranh giới công cụ của mô phỏng; không chứng minh một LLM thật chống được mọi injection. / Identify leaks in the deliberately flawed baseline and where the corrected version blocks them. Compare fixture hashes, configuration and regression cases. Injection fixtures test mock tool boundaries, not general real-LLM resistance."),
    }[lab]
    return [markdown(f"# Lab {lab.upper()} · {title}\n\n{purpose}"), markdown(INTRO),
            code(BOOTSTRAP), code(f"from research_lab import lab_{lab}\nreport = lab_{lab}.run()\nprint(json.dumps(report, ensure_ascii=False, indent=2))\n"),
            markdown("## Đọc kết quả và thử thay đổi / Inspect and experiment\n\n" + exercise)]

def build(lab):
    cells = lab_cells(lab)
    bootstrap_index = next(i for i, cell in enumerate(cells) if cell["source"] == BOOTSTRAP)
    cells.insert(bootstrap_index + 1, code(SUMMARY))
    if lab == "a":
        cells += [markdown("""## 4. Ablation và lỗi khó hơn / Ablation and harder failures

Giữ baseline, BM25, vector, hybrid và rerank cùng corpus và câu hỏi. Mặc định vector là trigram ký tự, rerank là heuristic bigram; **không phải model neural**. Nếu đã chạy embedding thật ở trên, backend đó sẽ được dùng. RRF của lab dùng hạng từ 1 và hằng số 60. Năm probe mới chỉ thuộc dev riêng; hai lỗi trên baseline hiện tại là paraphrase và hỏi chi tiết không có trong nguồn. Đọc các ca sai, không gộp probe vào test.

Compare methods on identical data. Default vectors are character trigrams and reranking is a bigram heuristic, not neural inference. A loaded embedding backend replaces only the vector retriever. Inspect separate dev stress failures; keep test unchanged.
"""), code('from research_lab.experiments import run as run_ablation\nreport["ablation"] = run_ablation("dev", embedding_backend=globals().get("backend"))\nfor method, score in report["ablation"]["methods"].items():\n    print(method, score["retrieval"], score["latency_ms"], score["failures"])\nprint("Separate dev probes:", report["ablation"]["dev_probes"]["lexical"]["failures"])\n'),
                  markdown("""## 5. Generation tùy chọn trên Colab / Optional hosted generation

Mặc định **không tải model**. Chỉ đổi `RUN_GENERATION=True` khi muốn tải Qwen2.5-0.5B-Instruct vào runtime Colab; chạy ô cài package đã ghim ở phần 2 trước. CPU cần RAM và thời gian, Colab có thể giới hạn tài nguyên. Không chạy trên local runtime. Model/revision lấy từ [model card chính thức](https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct); đây là thí nghiệm, không phải model được chứng nhận phù hợp tiếng Việt.

Hai câu dev dùng cùng lexical retriever: giờ mở thư viện và mức phạt trả muộn. Nguồn có giờ mở cửa nhưng không có phí phạt; câu thứ hai cần từ chối. Đầu ra model có thể sai hoặc thiếu citation; giữ kết quả thật, chấm từng claim `supported/unsupported/unclear` trong `human_claim_review`, không sửa output cho khớp đáp án. Citation ID hợp lệ không chứng minh groundedness. Chưa chạy model thì lưu `not_run`; không ghi metric giả. API Docker ở capstone vẫn là baseline trích xuất, không tự sử dụng model Colab này.

The default downloads no generation model. Enable only in hosted Colab after pinned package setup. Review the actual outputs of two dev questions, including the unsupported fee. Keep errors, token counts and measured latency; manually assess every claim. Valid IDs are not semantic support. The Docker API remains an extractive baseline, separate from this optional generation experiment.
"""), code('RUN_GENERATION = False\nreport["generation_experiment"] = {"status": "not_run"}\nif RUN_GENERATION:\n    from research_lab.generation import run_colab_generation\n    report["generation_experiment"] = run_colab_generation()\n    print(json.dumps(report["generation_experiment"], ensure_ascii=False, indent=2))\nelse:\n    print("Generation NOT RUN. No generation model downloaded.")\n'),
                  markdown("""## 6. Chỉ mở test sau khi chốt cách làm / Final test after freezing the approach

Đổi RUN_FINAL_TEST thành True khi đã ghi quyết định dựa trên dev. Không chỉnh thuật toán theo các lỗi test vừa xem; muốn đánh giá độc lập lần sau, cần bộ test mới chưa xem. Bộ câu hỏi công khai này chỉ minh họa quy trình đánh giá.

Set RUN_FINAL_TEST to True after documenting your dev-based decisions. Do not tune against test failures you have just seen; use a fresh unseen set for a later independent evaluation. These public questions demonstrate the evaluation procedure.
"""), code('RUN_FINAL_TEST = False\nif RUN_FINAL_TEST:\n    final_test = lab_a.run(embedding_backend=globals().get("backend"), split="test")\n    report["final_test_evaluation"] = final_test\n    print(json.dumps(final_test, ensure_ascii=False, indent=2))\nelse:\n    print("Test not run. Freeze your dev decisions before enabling this cell.")\n')]
    cells += [markdown("## Lưu bằng chứng / Save evidence\n\nTải báo cáo, ghi lại một lỗi bạn hiểu được và một thay đổi muốn thử. Tiến độ Journey cần được bạn tự cập nhật. / Download the report, explain one failure and propose one change. Update your Journey progress yourself."),
              code(EXPORT.replace("REPORT_NAME", NAMES[lab]))]
    for cell in cells:
        if cell["cell_type"] == "code":
            cell["source"] = cell["source"].replace(
                "report = lab_a.run()", "backend = None\nreport = lab_a.run()")
            cell["source"] = cell["source"].replace(
                "print(json.dumps(report, ensure_ascii=False, indent=2))", "show_report(report)")
            cell["source"] = cell["source"].replace(
                "print(json.dumps(final_test, ensure_ascii=False, indent=2))", "show_report(final_test)")
    for index, cell in enumerate(cells):
        cell["id"] = f"lab-{lab}-{index:02d}"
        if cell["cell_type"] == "code":
            compile(cell["source"], f"lab-{lab}-cell-{index}", "exec")
    notebook = {"nbformat": 4, "nbformat_minor": 5, "metadata": {
        "colab": {"name": NAMES[lab] + ".ipynb"},
        "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
        "language_info": {"name": "python", "version": "3.11"},
    }, "cells": cells}
    destination = ROOT / "notebooks" / (NAMES[lab] + ".ipynb")
    destination.parent.mkdir(exist_ok=True)
    destination.write_text(json.dumps(notebook, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"Built {destination.relative_to(ROOT)} ({destination.stat().st_size} bytes)")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("lab", choices=tuple(NAMES))
    build(parser.parse_args().lab)
