import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { AuthScreen } from '../auth/AuthScreen'
import type { CatalogLesson } from '../platform/hosted/catalog'
import { PublicLesson } from './PublicLesson'
import { PublicRoadmap } from './PublicRoadmap'
import { ThemeToggle } from '../theme/ThemeToggle'
import { usePublicLanguage } from './public-language'
import { authReturnPath, publicPage } from './public-navigation'
import './public.css'
import './public-lesson.css'
import './public-roadmap.css'

const PublicExercises = lazy(() => import('./PublicExercises'))

const samples = import.meta.glob<CatalogLesson>('../../content/curated/*.json', {
  eager: true,
  import: 'default',
})
const firstSlug = 'phase-00-onboarding-environment-1'
const lessonOrder = ['environment', 'baseline', 'learning-system']
const lessons = Object.values(samples).sort((a, b) => (
  lessonOrder.indexOf(a.module_id) - lessonOrder.indexOf(b.module_id) || a.lesson_id.localeCompare(b.lesson_id)
))

export function PublicExperience() {
  const [language, setLanguage] = usePublicLanguage()
  const [page, setPage] = useState(publicPage)
  const main = useRef<HTMLElement>(null)
  const lastPath = useRef(window.location.pathname)
  const vi = language === 'vi'
  const selectedLesson = lessons.find((lesson) => lesson.lesson_id === page)

  useEffect(() => {
    const restore = () => {
      setPage(publicPage())
      // In-page links keep native focus; only changing pages focuses the main region.
      if (lastPath.current === window.location.pathname) return
      lastPath.current = window.location.pathname
      requestAnimationFrame(() => {
        if (publicPage() === 'auth') document.getElementById('auth-title')?.focus()
        else main.current?.focus()
      })
    }
    window.addEventListener('popstate', restore)
    return () => window.removeEventListener('popstate', restore)
  }, [])

  const navigate = (next: string) => {
    setPage(next)
    const path = next === 'home' ? '/' : ['roadmap', 'exercises'].includes(next)
      ? `/${next}` : `/lesson/${encodeURIComponent(next)}`
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
    window.scrollTo({ top: 0, behavior: 'instant' })
    requestAnimationFrame(() => main.current?.focus())
  }

  const openSignIn = () => {
    const next = window.location.pathname + window.location.search + window.location.hash
    window.history.pushState({ publicAuth: true }, '', `/auth/sign-in?next=${encodeURIComponent(next)}`)
    window.dispatchEvent(new PopStateEvent('popstate'))
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  const closeSignIn = () => {
    if (window.history.state?.publicAuth) window.history.back()
    else {
      window.history.replaceState({}, '', authReturnPath())
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }
  if (page === 'auth') return <div className="public-auth">
    <div className="public-auth-toolbar"><button className="public-back" onClick={closeSignIn}>
      ← {vi ? 'Quay lại học thử' : 'Back to learning'}
    </button><button className="public-back" onClick={() => setLanguage(vi ? 'en' : 'vi')}
      aria-label={vi ? 'Switch to English' : 'Đổi sang tiếng Việt'}>{vi ? 'EN' : 'VI'}</button></div>
    <AuthScreen loading={false} language={language} />
  </div>

  return <div className="public-shell">
    <a href="#public-main" className="skip-link">{vi ? 'Đến nội dung' : 'Skip to content'}</a>
    <header className="public-nav">
      <button className="public-brand" onClick={() => navigate('home')} aria-label="Journey AI Engineer home">
        <span aria-hidden="true">J/</span> Journey <strong>AI Engineer</strong>
      </button>
      <nav aria-label={vi ? 'Điều hướng chính' : 'Main navigation'}>
        <ThemeToggle language={language} />
        <button onClick={() => navigate('roadmap')} aria-current={page === 'roadmap' ? 'page' : undefined}>
          {vi ? 'Lộ trình' : 'Roadmap'}</button>
        <button onClick={() => navigate('exercises')} aria-current={page === 'exercises' ? 'page' : undefined}>
          {vi ? 'Bài tập' : 'Exercises'}</button>
        <button onClick={() => setLanguage(vi ? 'en' : 'vi')} aria-label={vi ? 'Switch to English' : 'Đổi sang tiếng Việt'}>
          {vi ? 'EN' : 'VI'}
        </button>
        <button className="public-login" onClick={openSignIn}>{vi ? 'Đăng nhập' : 'Sign in'}</button>
      </nav>
    </header>
    <main id="public-main" ref={main} tabIndex={-1}>
      {selectedLesson ? <>
        <button className="public-back" onClick={() => navigate('home')}>← {vi ? 'Bài học mẫu' : 'Sample lessons'}</button>
        <PublicLesson lesson={selectedLesson} language={language} onSignIn={openSignIn} />
      </> : page === 'roadmap' ? <PublicRoadmap language={language} standalone onStart={() => navigate(firstSlug)} />
        : page === 'exercises' ? <>
        <h1 className="sr-only">{vi ? 'Bài tập' : 'Exercises'}</h1>
        <Suspense fallback={<p role="status">{vi ? 'Đang tải bài tập…' : 'Loading exercises…'}</p>}>
          <PublicExercises language={language} />
        </Suspense>
      </> : page !== 'home' ? <section>
        <h1>{vi ? 'Bài này chưa có trong bộ học thử' : 'This lesson is not in the sample collection'}</h1>
        <p>{vi ? 'Bạn có thể đọc 10 bài mẫu hoặc đăng nhập để mở toàn bộ thư viện.'
          : 'Read the ten sample lessons, or sign in to explore the full library.'}</p>
        <button className="public-primary" onClick={() => navigate(firstSlug)}>{vi ? 'Mở bài đầu tiên' : 'Open the first lesson'}</button>
      </section> : <>
        <section className="public-hero">
          <div>
            <span className="eyebrow">{vi ? 'MÃ NGUỒN MỞ · VI / EN · WEB & WINDOWS' : 'OPEN SOURCE · VI / EN · WEB & WINDOWS'}</span>
            <h1>{vi ? <>Học AI.<br />Làm ra <em>sản phẩm.</em></> : <>Learn AI.<br />Build <em>something real.</em></>}</h1>
            <p className="public-lead">{vi
              ? 'Một hành trình có bài học, thực hành và ôn tập. Bắt đầu bằng Python, tiến tới ứng dụng AI có bằng chứng hoạt động.'
              : 'Lessons, practice and spaced review in one journey. Start with Python and work towards AI applications you can demonstrate.'}</p>
            <div className="public-actions">
              <button className="public-primary" onClick={() => navigate(firstSlug)}>
                {vi ? 'Học thử bài đầu tiên' : 'Try your first lesson'} →
              </button>
              <button className="public-secondary" onClick={() => navigate('roadmap')}>
                {vi ? 'Khám phá lộ trình' : 'Explore the roadmap'}
              </button>
            </div>
            <p className="public-footnote">{vi ? 'Không cần tài khoản để học thử. Không cần Git để bắt đầu.'
              : 'No account to try a lesson. No Git to get started.'}</p>
          </div>
          <aside className="public-artifact" aria-label={vi ? 'Sản phẩm đầu tiên' : 'Your first artifact'}>
            <span className="eyebrow">01 / {vi ? 'BẮT ĐẦU NHỎ' : 'START SMALL'}</span>
            <h2>{vi ? 'Một file Python.\nMột kết quả thật.' : 'One Python file.\nOne real result.'}</h2>
            <div className="artifact-filename">environment_check.py</div>
            <pre><code>{'import sys\n\nprint(sys.version)\nprint(sys.executable)'}</code></pre>
            <p>{vi ? 'Chạy trên máy của bạn, lưu output và giải thích Python nào đang thực thi chương trình.'
              : 'Run it on your computer, save the output and explain which Python is executing your program.'}</p>
            <span className="artifact-check">{vi ? 'Đầu ra buổi học đầu tiên' : 'Your first session outcome'}</span>
          </aside>
        </section>
        <section className="public-samples" aria-labelledby="samples-title">
          <div className="public-section-heading">
            <div><span className="eyebrow">{vi ? 'HỌC THỬ' : 'TRY IT'}</span>
              <h2 id="samples-title">{vi ? 'Mười bài để khởi động.' : 'Ten lessons to get going.'}</h2></div>
            <p>{vi ? 'Đọc, chạy ví dụ, tự trả lời. Các bài mẫu đã được rà soát nội dung; phần còn lại đang tiếp tục biên tập.'
              : 'Read, run an example, recall what you learned. These samples are reviewed; the broader library is still being edited.'}</p>
          </div>
          <ol className="public-lesson-list">{lessons.map((lesson, index) => <li key={lesson.lesson_id}>
            <button onClick={() => navigate(lesson.lesson_id)}>
              <span className="sample-number">{String(index + 1).padStart(2, '0')}</span>
              <span><strong>{vi ? lesson.title_vi : lesson.title_en}</strong>
                <small>{lesson.estimated_minutes} {vi ? 'phút đọc dự kiến' : 'estimated reading minutes'}</small></span>
              <span aria-hidden="true">↗</span>
            </button>
          </li>)}</ol>
        </section>
        <PublicRoadmap language={language} onStart={() => navigate(firstSlug)} />
        <section className="public-modes">
          <h2>{vi ? 'Học ở web. Thực hành ở local.' : 'Learn on the web. Practise locally.'}</h2>
          <div><article><h3>Web beta</h3><p>{vi ? 'Đọc bài ngay. Có tài khoản để lưu tiến độ, ghi chú và ôn tập riêng.'
            : 'Read right away. Sign in for personal progress, notes and spaced reviews.'}</p></article>
            <article><h3>Windows / source</h3><p>{vi ? 'Giữ dữ liệu trên máy, mở workspace, chạy Python và lưu bài làm. GitHub là tùy chọn.'
              : 'Keep data on your machine, open workspaces, run Python and save your work. GitHub is optional.'}</p>
              <a href="https://github.com/Hzyl/JourneyAIEngineer/releases">{vi ? 'Tải bản Windows ↗' : 'Download for Windows ↗'}</a>
            </article></div>
        </section>
      </>}
    </main>
    <footer className="public-footer">
      <p>Journey AI Engineer · {vi ? 'Học bằng cách làm.' : 'Learn by building.'}</p>
      <a href="https://github.com/Hzyl/JourneyAIEngineer">{vi ? 'Source, góp ý & đóng góp trên GitHub ↗' : 'Source, feedback & contributions on GitHub ↗'}</a>
    </footer>
  </div>
}
