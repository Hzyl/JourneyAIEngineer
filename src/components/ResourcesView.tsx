import { LearningIllustration } from './LearningIllustration'
import { useEffect, useState } from 'react'
import type { ReferenceResource } from '../api'

const phaseTitles = [
  'Onboarding', 'Python & Software Engineering', 'Math & Machine Learning',
  'Classical Machine Learning', 'Deep Learning with PyTorch',
  'Deployment & MLOps', 'NLP, LLM & RAG', 'Capstone & Career', 'Software Engineering',
  'ML Fundamentals', 'Deep Learning & Transformer', 'LLM Application Engineering',
  'RAG Foundations', 'Advanced RAG', 'Tool Calling', 'AI Agents', 'MCP', 'Evaluation',
  'Observability', 'Production Engineering', 'Fine-tuning', 'Local LLM', 'AI System Design',
]
const resourceTypes: Record<string, [string, string]> = {
  book: ['Sách', 'Book'], course: ['Khóa học', 'Course'], documentation: ['Tài liệu kỹ thuật', 'Documentation'],
  docs: ['Tài liệu kỹ thuật', 'Documentation'], repository: ['Kho mã nguồn', 'Repository'],
  roadmap: ['Lộ trình', 'Roadmap'], practice: ['Thực hành', 'Practice'],
  'architecture guide': ['Hướng dẫn kiến trúc', 'Architecture guide'],
  'book + notebooks': ['Sách và notebook', 'Book + notebooks'],
  'course notes': ['Bài giảng', 'Course notes'],
  'engineering guide': ['Hướng dẫn kỹ thuật', 'Engineering guide'],
  'engineering recipes': ['Ví dụ kỹ thuật', 'Engineering recipes'],
  'github docs': ['Tài liệu trên GitHub', 'GitHub docs'],
  'github notebooks': ['Notebook trên GitHub', 'GitHub notebooks'],
  'github notes': ['Ghi chú trên GitHub', 'GitHub notes'],
  'github repo': ['Kho mã trên GitHub', 'GitHub repo'],
  'official docs': ['Tài liệu chính thức', 'Official docs'],
  specification: ['Đặc tả', 'Specification'],
}
const parameter = (name: string, fallback: string) => typeof window === 'undefined'
  ? fallback : new URLSearchParams(window.location.search).get(name) ?? fallback

export function ResourcesView({ resources, language }: {
  resources: ReferenceResource[]
  language: 'vi' | 'en'
}) {
  const vi = language === 'vi'
  const [query, setQuery] = useState(() => parameter('q', ''))
  const [phase, setPhase] = useState(() => parameter('phase', 'all'))
  const [type, setType] = useState(() => parameter('type', 'all'))
  const typeLabel = (value: string) => resourceTypes[value.toLowerCase()]?.[vi ? 0 : 1] ?? value
  const phaseLabels = Object.fromEntries(phaseTitles.map((title, index) => {
    const translated = vi && index === 2 ? 'Toán và học máy'
      : vi && index === 4 ? 'Học sâu với PyTorch' : title
    const prefix = index < 8 ? `${vi ? 'Giai đoạn' : 'Phase'} ${index}` : `GenAI ${index - 7}`
    return [`phase-${String(index).padStart(2, '0')}`, `${prefix} · ${translated}`]
  }))
  useEffect(() => {
    const restore = () => {
      setQuery(parameter('q', ''))
      setPhase(parameter('phase', 'all'))
      setType(parameter('type', 'all'))
    }
    window.addEventListener('popstate', restore)
    return () => window.removeEventListener('popstate', restore)
  }, [])
  useEffect(() => {
    if (window.location.pathname !== '/resources') return
    const params = new URLSearchParams(window.location.search)
    if (query.trim()) params.set('q', query.trim())
    else params.delete('q')
    if (phase !== 'all') params.set('phase', phase)
    else params.delete('phase')
    if (type !== 'all') params.set('type', type)
    else params.delete('type')
    const search = params.toString()
    const nextUrl = `/resources${search ? `?${search}` : ''}`
    if (`${window.location.pathname}${window.location.search}` !== nextUrl) {
      window.history.replaceState(window.history.state, '', nextUrl)
    }
  }, [query, phase, type])
  const visible = resources.filter((resource) => {
    const haystack = [resource.title_vi, resource.title_en, resource.provider,
      resource.description_vi, resource.description_en].join(' ').toLowerCase()
    return (!query.trim() || haystack.includes(query.trim().toLowerCase()))
      && (phase === 'all' || resource.phase_ids.includes(phase))
      && (type === 'all' || resource.type === type)
  })
  const types = Array.from(new Set(resources.map((resource) => resource.type)))

  return <div>
    <div className="page-intro resources-intro">
      <div>
        <span className="eyebrow accent">{vi ? 'THƯ VIỆN THAM KHẢO' : 'REFERENCE LIBRARY'}</span>
        <h2>{vi ? 'Học từ nguồn' : 'Learn from sources'}<br />
          <em>{vi ? 'có thể kiểm chứng.' : 'you can verify.'}</em>
        </h2>
      </div>
      <p>{vi
        ? 'Sách, khóa học, tài liệu và kho mã nguồn được gắn với giai đoạn. Đọc theo mục tiêu bài học, ghi lại điều đã kiểm chứng rồi quay về làm bài.'
        : 'Books, courses, documentation and repositories mapped to each phase. Read with a lesson goal, verify what you learn, then return to practice.'}</p>
    </div>
    <section className="resource-library-card">
      <LearningIllustration name="resources" />
    <div className="resource-library-header">
        <div>
          <span className="eyebrow">{resources.length} {vi ? 'NGUỒN' : 'SOURCES'}</span>
          <h3>{vi ? 'Thư viện tài liệu AI Engineer' : 'AI Engineer reference library'}</h3>
        </div>
        <p>{vi
          ? 'Nguồn cộng đồng như AI Engineering from Scratch được giữ lại để tham khảo; nguồn chính thức giúp kiểm tra API và chuẩn kỹ thuật.'
          : 'Community references such as AI Engineering from Scratch sit alongside official sources for API and engineering verification.'}</p>
      </div>
      <div className="filter-bar resource-filters">
        <label className="sr-only" htmlFor="resource-query">{vi ? 'Tìm tài liệu' : 'Search resources'}</label>
        <input id="resource-query" type="search" value={query} onChange={(event) => setQuery(event.target.value)}
          placeholder={vi ? 'Tìm theo tên, tác giả, chủ đề...' : 'Search by title, provider or topic...'} />
        <label className="sr-only" htmlFor="resource-phase">{vi ? 'Lọc theo giai đoạn' : 'Filter by phase'}</label>
        <select id="resource-phase" value={phase} onChange={(event) => setPhase(event.target.value)}>
          <option value="all">{vi ? 'Tất cả giai đoạn' : 'All phases'}</option>
          {Object.entries(phaseLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
        <label className="sr-only" htmlFor="resource-type">{vi ? 'Lọc theo loại' : 'Filter by type'}</label>
        <select id="resource-type" value={type} onChange={(event) => setType(event.target.value)}>
          <option value="all">{vi ? 'Mọi loại nguồn' : 'All types'}</option>
          {types.map((item) => <option key={item} value={item}>{typeLabel(item)}</option>)}
        </select>
        <span className="muted" role="status">{visible.length}/{resources.length} {vi ? 'nguồn' : 'sources'}</span>
      </div>
      <div className="resource-grid">
        {visible.map((resource) => <article className={`resource-card ${resource.featured ? 'featured' : ''}`}
          key={resource.slug}>
          <div className="resource-card-top">
            <span className="tag">{typeLabel(resource.type)}</span>
            <span className="resource-language">{resource.language.toUpperCase()}</span>
          </div>
          <h4>{vi ? resource.title_vi : resource.title_en}</h4>
          <p className="resource-provider">{resource.provider} · {resource.official
            ? (vi ? 'Nguồn chính thức' : 'Official') : (vi ? 'Nguồn cộng đồng' : 'Community reference')}</p>
          <p>{vi ? resource.description_vi : resource.description_en}</p>
          <div className="resource-phases">
            {resource.phase_ids.map((id) => <span key={id}>{phaseLabels[id]?.split(' · ')[0] ?? id}</span>)}
          </div>
          <div className="resource-how">
            <strong>{vi ? 'Cách dùng trong lộ trình' : 'How to use it'}</strong>
            <p>{vi ? resource.how_to_use_vi : resource.how_to_use_en}</p>
          </div>
          {resource.url ? <a className="resource-link" href={resource.url} target="_blank" rel="noreferrer">
            {vi ? 'Mở nguồn tham khảo' : 'Open reference'} <span aria-hidden="true">↗</span>
          </a> : <p className="resource-internal-note">
            {vi ? 'Nội dung này có sẵn trong ứng dụng.' : 'This content is available in the app.'}
          </p>}
        </article>)}
      </div>
      {visible.length === 0 && <div className="empty-state">
        <div className="detail-mark" aria-hidden="true">✦</div>
        <h3>{vi ? 'Không tìm thấy tài liệu' : 'No resources found'}</h3>
        <p>{vi ? 'Thử từ khóa khác hoặc bỏ bộ lọc giai đoạn.' : 'Try another keyword or clear the phase filter.'}</p>
      </div>}
    </section>
  </div>
}
