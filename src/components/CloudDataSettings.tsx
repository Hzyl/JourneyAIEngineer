import { DeleteAccount } from './DeleteAccount'
import { useCloudExport } from './useCloudExport'

export function CloudDataSettings({ language }: { language: 'vi' | 'en' }) {
  const vi = language === 'vi'
  const { busy, exported, error, download } = useCloudExport()
  const errors = vi ? {
    account: 'Tài khoản đã thay đổi. Chưa tải file; hãy xuất lại cho tài khoản hiện tại.',
    export: 'Chưa xuất được dữ liệu. Kiểm tra kết nối và thử lại. Nếu vẫn lỗi, tính năng có thể chưa sẵn sàng.',
  } : {
    account: 'The account changed. No file was downloaded; export again for the current account.',
    export: 'Could not export data. Check your connection and retry. If it still fails, export may not be available yet.',
  }
  return <><section className="section-card backup-card">
    <span className="eyebrow">{vi ? 'DỮ LIỆU WEB' : 'CLOUD DATA'}</span>
    <h3>{vi ? 'Dữ liệu thuộc về bạn' : 'Your learning data'}</h3>
    <p>{vi ? 'Tải tiến độ, lịch sử ôn tập, phiên học, notes, journal và cài đặt của tài khoản này.'
      : 'Download this account’s progress, review history, study sessions, notes, journal and settings.'}</p>
    <p className="muted">{vi ? 'File có nội dung riêng tư. Đây là bản xuất dữ liệu web, chưa dùng để khôi phục SQLite hoặc nhập sang tài khoản khác.'
      : 'The file contains private content. This web export cannot yet restore SQLite or import into another account.'}</p>
    <button className="secondary-button" disabled={busy} aria-busy={busy} onClick={() => void download()}>
      {busy ? (vi ? 'Đang xuất…' : 'Exporting…') : (vi ? 'Tải dữ liệu JSON' : 'Download JSON export')}
    </button>
    {exported && <p role="status" className="success-note">{vi
      ? 'Đã tạo file xuất dữ liệu. Hãy kiểm tra thư mục tải xuống.'
      : 'Export created. Check your downloads folder.'}</p>}
    {error && <p role="alert" className="warning-note">{errors[error]}</p>}
  </section><DeleteAccount language={language} /></>
}
