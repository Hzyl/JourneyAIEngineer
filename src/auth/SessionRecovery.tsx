import { useEffect, useRef } from 'react'
import { useAuth } from './AuthProvider'
import { usePublicLanguage } from '../public/public-language'
import './session-controls.css'

export function SessionRecovery() {
  const { retrySession } = useAuth()
  const [language] = usePublicLanguage()
  const vi = language === 'vi'
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => { heading.current?.focus() }, [])
  return <main className="session-recovery">
    <section aria-labelledby="session-recovery-title">
      <h1 id="session-recovery-title" ref={heading} tabIndex={-1}>
        {vi ? 'Chưa đọc được phiên đăng nhập' : 'Could not read your sign-in session'}
      </h1>
      <p>{vi
        ? 'Kiểm tra kết nối rồi thử lại. Tiến độ đã lưu của bạn không bị xóa.'
        : 'Check your connection and try again. Your saved progress has not been deleted.'}</p>
      <button className="primary-button" onClick={retrySession}>
        {vi ? 'Thử lại' : 'Try again'}
      </button>
    </section>
  </main>
}
