import type { PublicLanguage } from '../public/public-language'

export function AuthIntro({ language }: { language: PublicLanguage }) {
  const vi = language === 'vi'
  const values = vi ? [
    ['Tiến độ có ngữ cảnh', 'Lesson, notes và journal nằm cùng một hành trình.'],
    ['Ôn tập đúng lúc', 'Lịch review giúp bạn nhận ra chủ đề còn yếu.'],
    ['Chỉ bạn truy cập', 'Dữ liệu web được tách theo tài khoản.'],
  ] : [
    ['Progress with context', 'Lessons, notes and your journal stay in one learning journey.'],
    ['Review at the right time', 'Spaced reviews help you identify topics that need more practice.'],
    ['Your own learning data', 'Web data is separated by account.'],
  ]
  return <aside className="auth-intro" aria-label={vi ? 'Giới thiệu Journey AI Engineer' : 'About Journey AI Engineer'}>
    <div className="brand-lockup">
      <div className="brand-mark">J</div><div><strong>Journey</strong><span>AI Engineer</span></div>
    </div>
    <span className="eyebrow">WEB BETA · CLOUD SYNC</span>
    <h1>{vi ? <>Học có hệ thống.<br />Lưu lại bằng chứng.</> : <>Learn with a plan.<br />Keep proof of your work.</>}</h1>
    <p>{vi ? 'Không gian học AI Engineer giúp bạn theo dõi roadmap, luyện review và ghi lại dự án theo từng tuần.'
      : 'Follow an AI engineering roadmap, practise recall and document your projects week by week.'}</p>
    <ol className="auth-value-list">{values.map(([title, description]) => <li key={title}>
      <strong>{title}</strong><span>{description}</span>
    </li>)}</ol>
    <p className="auth-intro-footnote">{vi ? 'Workspace, VS Code và Git vẫn dành cho bản desktop/source clone.'
      : 'Workspaces, VS Code and Git are available in the desktop app or source checkout.'}</p>
  </aside>
}
