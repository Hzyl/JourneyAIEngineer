import type { PublicLanguage } from '../public/public-language'

export function AuthIntro({ language }: { language: PublicLanguage }) {
  const vi = language === 'vi'
  const values = vi ? [
    ['Theo dõi việc học', 'Theo dõi bài học, ghi chú và nhật ký trong cùng một nơi.'],
    ['Ôn tập đúng lúc', 'Lịch ôn tập giúp bạn nhận ra chủ đề cần luyện thêm.'],
    ['Dữ liệu học của bạn', 'Dữ liệu web được tách theo tài khoản.'],
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
    <p>{vi ? 'Theo dõi lộ trình AI Engineer, ôn lại kiến thức và ghi lại kết quả dự án theo từng tuần.'
      : 'Follow an AI engineering roadmap, practise recall and document your projects week by week.'}</p>
    <ol className="auth-value-list">{values.map(([title, description]) => <li key={title}>
      <strong>{title}</strong><span>{description}</span>
    </li>)}</ol>
    <p className="auth-intro-footnote">{vi ? 'Để mở thư mục bài tập bằng VS Code và dùng Git, bạn cần bản chạy trên máy hoặc bản sao mã nguồn.'
      : 'Workspaces, VS Code and Git are available in the desktop app or source checkout.'}</p>
  </aside>
}
