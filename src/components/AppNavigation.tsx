import type { RefObject } from 'react'
import { GitHubLink } from './GitHubLink'
import './app-navigation.css'

type Item = { id: string; label: string; icon: string; hint: string }

export function AppNavigation({ items, view, hosted, language, mobile, open, panel, onClose, onSelect }: {
  items: Item[]
  view: string
  hosted: boolean
  language: 'vi' | 'en'
  mobile: boolean
  open: boolean
  panel: RefObject<HTMLElement | null>
  onClose: () => void
  onSelect: (id: string) => void
}) {
  const vi = language === 'vi'
  const label = vi ? 'Điều hướng chính' : 'Primary navigation'
  return <>
    <div className={`mobile-nav-scrim ${open ? 'open' : ''}`} aria-hidden="true" onClick={onClose} />
    <aside id="app-navigation" ref={panel} className={`sidebar ${open ? 'open' : ''}`}
      role={mobile ? 'dialog' : undefined} aria-modal={open ? true : undefined}
      aria-label={label} inert={mobile && !open}>
      <div className="brand-lockup">
        <div className="brand-mark">J</div>
        <div><strong>Journey</strong><span>AI Engineer</span></div>
        <button className="mobile-nav-close" type="button"
          aria-label={vi ? 'Đóng menu điều hướng' : 'Close navigation'} onClick={onClose}>×</button>
      </div>
      <div className="sidebar-intro">{vi ? 'Học đều, thực hành và ghi lại bằng chứng.'
        : 'Learn steadily, practise and keep evidence.'}</div>
      <GitHubLink language={language} />
      <nav aria-label={label} className="nav-list">
        {items.filter((item) => !hosted || item.id !== 'security').map((item) => {
          const current = view === item.id || (view === 'lesson' && item.id === 'roadmap')
          return <button className={`nav-item ${current ? 'active' : ''}`} key={item.id}
            onClick={() => onSelect(item.id)} aria-current={current ? 'page' : undefined}>
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            <span><strong>{item.label}</strong><small>{item.hint}</small></span>
          </button>
        })}
      </nav>
      <div className="sidebar-footer">
        <div className="status-dot"><span />{hosted
          ? (vi ? 'Đồng bộ tài khoản' : 'Cloud sync') : (vi ? 'Không gian trên máy' : 'Local workspace')}</div>
        <small>{hosted ? (vi ? 'Dữ liệu được lưu riêng theo tài khoản' : 'Learning data is private to your account')
          : (vi ? 'Tiến độ được lưu trên máy của bạn' : 'Progress is saved on this device')}</small>
        <small>{hosted ? (vi ? 'VS Code, Git và kiểm thử chỉ chạy trên bản dùng trên máy.'
          : 'VS Code, Git and tests are available in local mode.')
          : (vi ? 'Bản chạy trực tiếp tự dừng khi bạn đóng thẻ trình duyệt cuối cùng.' : 'The portable app stops after its last tab closes.')}</small>
      </div>
    </aside>
  </>
}
