import { useState } from 'react'
import type { SecurityFinding } from '../api'

type Severity = 'all' | SecurityFinding['severity']
type Status = 'all' | SecurityFinding['status']

export function SecurityFindings({ findings, language }: {
  findings: SecurityFinding[]
  language: 'vi' | 'en'
}) {
  const vi = language === 'vi'
  const [severity, setSeverity] = useState<Severity>('all')
  const [status, setStatus] = useState<Status>('all')
  const severities: Record<Severity, string> = {
    all: vi ? 'Mọi mức' : 'All levels', critical: vi ? 'Nghiêm trọng' : 'Critical',
    high: vi ? 'Cao' : 'High', medium: vi ? 'Vừa' : 'Medium', low: vi ? 'Thấp' : 'Low',
    info: vi ? 'Thông tin' : 'Information',
  }
  const statuses: Record<Status, string> = {
    all: vi ? 'Mọi trạng thái' : 'All statuses', candidate: vi ? 'Cần xem xét' : 'Candidate',
    needs_human_review: vi ? 'Cần người kiểm tra' : 'Needs human review',
    verified_control: vi ? 'Kiểm tra source đạt' : 'Source check passed',
  }
  const visible = findings.filter((finding) =>
    (severity === 'all' || finding.severity === severity) && (status === 'all' || finding.status === status))
  return <section className="section-card security-findings-card">
    <div className="section-heading">
      <div>
        <span className="eyebrow">{vi ? 'DANH SÁCH CẦN XEM' : 'REVIEW QUEUE'}</span>
        <h3>{vi ? 'Dấu hiệu cần đọc trong code' : 'Patterns to review in code'}</h3>
      </div>
      <span className="tag" role="status">{vi ? 'Hiển thị' : 'Showing'} {visible.length}/{findings.length}</span>
    </div>
    <div className="security-filters">
      <label>{vi ? 'Mức độ' : 'Severity'}
        <select value={severity} onChange={(event) => setSeverity(event.target.value as Severity)}>
          {Object.entries(severities).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <label>{vi ? 'Trạng thái' : 'Status'}
        <select value={status} onChange={(event) => setStatus(event.target.value as Status)}>
          {Object.entries(statuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
    </div>
    {visible.length === 0 ? <div className="security-empty" role="status">
      <h4>{vi ? 'Không có kết quả phù hợp' : 'No matching findings'}</h4>
      <p>{vi ? 'Thử bỏ bớt bộ lọc hoặc kiểm tra lại source.' : 'Clear a filter or review the source again.'}</p>
      {(severity !== 'all' || status !== 'all') && <button className="text-button" onClick={() => {
        setSeverity('all')
        setStatus('all')
      }}>{vi ? 'Xóa bộ lọc' : 'Clear filters'}</button>}
    </div> : <div className="security-finding-list">
      {visible.map((finding, index) => <article className={`security-finding security-${finding.status}`}
        key={`${finding.id}-${finding.source_file}-${finding.source_line}-${index}`}>
        <div className="security-finding-top">
          <div className="security-finding-tags">
            <span className={`security-severity severity-${finding.severity}`}>{severities[finding.severity]}</span>
            <span className="security-status">{statuses[finding.status]}</span>
          </div>
          {finding.path && <code>{finding.methods.join(' / ')} {finding.path}</code>}
        </div>
        <h4>{vi ? finding.title_vi : finding.title_en}</h4>
        <p className="security-evidence"><strong>{vi ? 'Bằng chứng:' : 'Evidence:'}</strong>{' '}
          {vi ? finding.evidence : finding.evidence_en}</p>
        <p className="security-remediation"><strong>{vi ? 'Bước tiếp theo:' : 'Next step:'}</strong>{' '}
          {vi ? finding.remediation_vi : finding.remediation_en}</p>
        {finding.source_file && <small className="security-source">
          {finding.source_file}{finding.source_line ? `:${finding.source_line}` : ''}
        </small>}
      </article>)}
    </div>}
  </section>
}
