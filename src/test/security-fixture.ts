import type { SecurityAuditReport } from '../api'

export const securityReport: SecurityAuditReport = {
  mode: 'passive', safe_mode: true, network_requests: 0, payloads_sent: 0, external_tools: [],
  source_root: 'project', route_count: 1,
  routes: [{ path: '/api/example', methods: ['GET'], name: 'example', endpoint: 'example', operation_id: null,
    mutating: false, body_model: null, unbounded_string_fields: [], source_file: 'apps/api/main.py', source_line: 10 }],
  findings: [
    { id: 'source-sql-fstring-10', severity: 'medium', status: 'needs_human_review',
      title_vi: 'SQL query được tạo bằng f-string', title_en: 'SQL query is built with an f-string',
      evidence: 'main.py:10 truyền f-string vào execute().', evidence_en: 'main.py:10 passes an f-string to execute().',
      remediation_vi: 'Kiểm tra giá trị động.', remediation_en: 'Review dynamic values.',
      path: null, methods: [], source_file: 'apps/api/main.py', source_line: 10 },
    { id: 'control-no-shell-true', severity: 'info', status: 'verified_control',
      title_vi: 'Không phát hiện shell=True', title_en: 'No shell=True call found',
      evidence: 'Không thấy shell=True trong file đã đọc.', evidence_en: 'No shell=True in the inspected file.',
      remediation_vi: 'Giữ argv list.', remediation_en: 'Keep argument lists.',
      path: null, methods: [], source_file: 'apps/api/main.py', source_line: null },
  ],
  summary: { status_counts: { needs_human_review: 1, verified_control: 1 }, severity_counts: { medium: 1, info: 1 },
    candidate_count: 0, needs_human_review: 1, verified_controls: 1 },
  limitations_vi: ['Không chứng nhận ứng dụng an toàn.'], limitations_en: ['Does not certify application security.'],
}
