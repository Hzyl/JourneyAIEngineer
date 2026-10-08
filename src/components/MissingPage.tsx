import { useEffect, useRef } from 'react'

export function MissingPage({ language, onRoadmap }: { language: 'vi' | 'en'; onRoadmap: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null)
  const vi = language === 'vi'
  useEffect(() => { heading.current?.focus() }, [])
  return <section className="empty-state route-missing">
    <h2 ref={heading} tabIndex={-1}>{vi ? 'Đường dẫn này không mở được' : 'This link is unavailable'}</h2>
    <p>{vi ? 'Đường dẫn có thể thiếu hoặc sai ký tự. Mở lộ trình để chọn lại bài bạn muốn học.'
      : 'The link may be incomplete or contain invalid characters. Open the roadmap to choose a lesson.'}</p>
    <button className="primary-button" onClick={onRoadmap}>{vi ? 'Mở lộ trình' : 'Open roadmap'}</button>
  </section>
}
