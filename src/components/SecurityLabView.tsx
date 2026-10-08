import type { SecurityAuditReport } from '../api'
import { SecurityFindings } from './SecurityFindings'
import { useSecurityAudit } from './useSecurityAudit'
import './security-layout.css'
import './security-findings.css'

export function SecurityLabView({ language }: { language: 'vi' | 'en' }) {
  const vi = language === 'vi'
  const { report, loading, failed, reload } = useSecurityAudit()
  return <div className="security-layout">
    <section className="security-hero">
      <div>
        <span className="eyebrow accent">{vi ? 'ĐỌC SOURCE THỤ ĐỘNG' : 'PASSIVE SOURCE REVIEW'}</span>
        <h2>{vi ? 'Đọc dấu hiệu rủi ro,' : 'Review risk patterns,'}<br />
          <em>{vi ? 'hiểu giới hạn kiểm tra.' : 'understand the limits.'}</em></h2>
        <p>{vi
          ? 'Đọc route FastAPI, schema input và một số mẫu code trong source local. Kết quả giúp chọn phần cần đọc và viết test, không chứng nhận ứng dụng an toàn.'
          : 'Read FastAPI routes, input schemas and selected patterns in local source files. Results help you choose code to inspect and test; they do not certify application security.'}</p>
      </div>
      <div className="security-safe-panel">
        <strong>{vi ? 'CHỈ ĐỌC SOURCE' : 'READ-ONLY REVIEW'}</strong>
        <span>{vi ? 'Không thực thi endpoint được kiểm tra' : 'No execution of inspected endpoints'}</span>
        <span>{vi ? 'Không gửi payload thử nghiệm' : 'No test payloads sent'}</span>
        <span>{vi ? 'Không chạy công cụ ngoài' : 'No external tools run'}</span>
      </div>
    </section>
    {failed && <div className="error-banner" role="alert">
      <strong>{vi ? 'Chưa tải được báo cáo.' : 'Could not load the report.'}</strong>{' '}
      {report ? (vi ? 'Đang giữ kết quả lần trước.' : 'Previous results are still shown.')
        : (vi ? 'Kiểm tra kết nối với app local rồi thử lại.' : 'Check the local app connection and try again.')}{' '}
      <button className="text-button" onClick={reload} disabled={loading}>{vi ? 'Thử lại' : 'Retry'}</button>
    </div>}
    {loading && !report && <p role="status">{vi ? 'Đang đọc source và route…' : 'Reading source and routes…'}</p>}
    {report && <>
      <section className="security-summary" aria-label={vi ? 'Tóm tắt kiểm tra' : 'Review summary'}>
        <div className="security-stat">
          <span>{vi ? 'Endpoint đã lập danh sách' : 'Endpoints inventoried'}</span>
          <strong>{report.route_count}</strong>
          <small>{vi ? 'Chỉ route /api trong app local' : 'Only local app /api routes'}</small>
        </div>
        <div className="security-stat warning">
          <span>{vi ? 'Cần người kiểm tra' : 'Needs human review'}</span>
          <strong>{report.summary.needs_human_review}</strong>
          <small>{vi ? 'Chưa phải lỗ hổng đã xác nhận' : 'Not confirmed vulnerabilities'}</small>
        </div>
        <div className="security-stat safe">
          <span>{vi ? 'Kiểm tra source đạt' : 'Source checks passed'}</span>
          <strong>{report.summary.verified_controls}</strong>
          <small>{vi ? 'Chỉ các mẫu code đã đọc được' : 'Only inspected source patterns'}</small>
        </div>
        <button className="secondary-button security-refresh" disabled={loading} aria-busy={loading} onClick={reload}>
          {loading ? (vi ? 'Đang kiểm tra…' : 'Reviewing…') : (vi ? 'Kiểm tra lại source' : 'Review source again')}
        </button>
      </section>
      <section className="security-method-card">
        <h3>{vi ? 'Đọc → kiểm tra → sửa → test' : 'Read → verify → fix → test'}</h3>
        <p>{vi
          ? 'Đọc handler và model tương ứng. Viết test trên local hoặc staging có ủy quyền, xác nhận vấn đề rồi mới sửa và chạy lại test.'
          : 'Read the relevant handler and model. Write tests in an authorized local or staging environment, confirm the issue, then fix it and rerun the tests.'}</p>
      </section>
      <SecurityFindings findings={report.findings} language={language} />
      <SecurityDetails report={report} vi={vi} />
    </>}
  </div>
}

function SecurityDetails({ report, vi }: { report: SecurityAuditReport; vi: boolean }) {
  return <>
    <details className="security-details">
      <summary>{vi ? 'Danh sách endpoint' : 'Endpoint inventory'} ({report.route_count})</summary>
      <p>{vi
        ? 'Metadata từ bảng route FastAPI; handler không được gọi khi lập danh sách.'
        : 'Metadata from the FastAPI route table; handlers are not called while building this inventory.'}</p>
      <div className="security-route-list" tabIndex={0} role="region"
        aria-label={vi ? 'Chi tiết endpoint' : 'Endpoint details'}>
        {report.routes.map((route) => <div className="security-route" key={`${route.path}-${route.methods.join(',')}`}>
          <div>
            <code>{route.methods.join(' / ')} {route.path}</code>
            <small>{route.name}{route.body_model ? ` · body ${route.body_model}` : ''}</small>
          </div>
          <span className={route.mutating ? 'security-route-write' : 'security-route-read'}>
            {route.mutating ? (vi ? 'Ghi dữ liệu' : 'Writes data') : (vi ? 'Chỉ đọc' : 'Read only')}
          </span>
        </div>)}
      </div>
    </details>
    <details className="security-details">
      <summary>{vi ? 'Giới hạn và cách đọc kết quả' : 'Limitations and interpretation'}</summary>
      <ul>{(vi ? report.limitations_vi : report.limitations_en).map((text) => <li key={text}>{text}</li>)}</ul>
      <p>{vi ? 'Phạm vi source:' : 'Source scope:'} <code>{report.source_root}</code>.{' '}
        {vi ? 'Chỉ hiển thị đường dẫn tương đối, không hiện profile máy.'
          : 'Only relative paths are shown, without the machine profile path.'}</p>
    </details>
  </>
}
