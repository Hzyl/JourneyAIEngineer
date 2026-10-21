# Execution boundaries / Ranh giới thực thi

Python 3.11+, standard library only. Run each file or paste it into one Colab cell. The four lessons embed the full code with Vietnamese/English explanations, exercises and acceptance criteria.

Python 3.11+, chỉ dùng thư viện chuẩn. Chạy từng file hoặc dán vào một ô Colab. Bốn bài học chứa toàn bộ mã, giải thích Việt/Anh, bài tập và tiêu chí nghiệm thu.

```bash
python samples/safe-tool-boundaries/tool_policy.py
python samples/safe-tool-boundaries/bounded_loop.py
python samples/safe-tool-boundaries/mcp_policy.py
python -m pytest tests/test_safe_tool_boundaries.py -q
```

Expected output, in command order / Đầu ra theo thứ tự ba lệnh chạy ví dụ:

```text
applied
already_applied
writes 1 observed reviewed
approval_mismatch
permission_denied

step_limit 5
repeated_query 2
evidence_found 1

resource ok
injected proposal tool_denied
alice private denied
bob private ok
```

Exercises: change principal/request/target/arguments after approval; test exact expiry, revoked permission, identical retry and post-write target drift. Inject read-tool timeouts and permission failures. Record status, write count and observed target state. Keep retrieved instructions as data and block unlisted tools.

Bài tập: đổi người/request/đích/tham số sau khi duyệt; thử đúng thời điểm hết hạn, thu hồi quyền, retry và trạng thái đích bị đổi sau ghi. Giả lập timeout công cụ đọc và lỗi quyền. Ghi trạng thái, số lần ghi và trạng thái đích quan sát được. Giữ câu lệnh trong tài liệu như dữ liệu và chặn tool ngoài allowlist.

This is a scripted policy simulator, not an MCP server/SDK, OAuth implementation, LLM agent or security certification. Only in-memory dictionaries change. Approval/principal channels are trusted fixtures, not authentication. Idempotency covers sequential execution in one process; concurrency/crashes need transactions/unique constraints or target-system support. Cooperative timeouts cannot interrupt hung Python functions. Existing Lab B/C remain unchanged.

Đây là scripted policy simulator, không phải MCP server/SDK, OAuth, LLM agent hoặc chứng nhận bảo mật. Chỉ dict RAM thay đổi. Kênh duyệt và principal là fixture đáng tin, không phải authentication. Idempotency chỉ được kiểm tra tuần tự trong một tiến trình; concurrency/crash cần transaction/unique constraint hoặc hỗ trợ ở hệ thống đích. Timeout hợp tác không ngắt hàm Python bị treo. Lab B/C cũ được giữ nguyên.

Official sources: [MCP tools 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18/server/tools), [MCP authorization 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization), [LangGraph interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts).
