import { illustrationForLesson } from '../components/learning-illustrations'
import { LearningIllustration } from '../components/LearningIllustration'
import { useState } from 'react'
import curriculum from '../../content/curriculum.json'
import routes from '../../content/learning_routes.json'
import roadmapOverview from '../../content/roadmap_overview.json'

type Props = { language: 'vi' | 'en'; standalone?: boolean; onStart: () => void }
type TrackFilter = 'all' | 'core' | 'specialization'

export function PublicRoadmap({ language, standalone, onStart }: Props) {
  const [selected, setSelected] = useState(() => {
    const requested = new URLSearchParams(window.location.search).get('route')
    return routes.routes.some((route) => route.id === requested) ? requested! : 'foundation'
  })
  const [track, setTrack] = useState<TrackFilter>(() => {
    const requested = new URLSearchParams(window.location.search).get('track')
    return requested === 'core' || requested === 'specialization' ? requested : 'all'
  })
  const vi = language === 'vi'
  const Heading = standalone ? 'h1' : 'h2'
  const route = routes.routes.find((item) => item.id === selected)!
  const stages = roadmapOverview.stages.filter((stage) => track === 'all' || stage.track === track)
  const setTrackFilter = (next: TrackFilter) => {
    setTrack(next)
    const url = new URL(window.location.href)
    if (next === 'all') url.searchParams.delete('track')
    else url.searchParams.set('track', next)
    window.history.replaceState(window.history.state, '', url)
  }
  return <section className="public-roadmap" id="roadmap" aria-labelledby="route-title">
    <span className="eyebrow">{vi ? 'LỘ TRÌNH CỦA BẠN' : 'YOUR LEARNING PATH'}</span>
    <Heading id="route-title">{vi ? 'Chọn đích đến. Bắt đầu vừa sức.' : 'Choose a direction. Start at your level.'}</Heading>
    <div className="roadmap-overview-hero">
      <div className="roadmap-overview-copy">
        <span className="eyebrow accent">{vi ? 'TỪ NỀN TẢNG ĐẾN PORTFOLIO' : 'FROM FOUNDATIONS TO PORTFOLIO'}</span>
        <h3>{vi ? 'Từ kiến thức nền tảng đến dự án thực tế.' : 'From foundations to practical projects.'}</h3>
        <p>{vi
          ? 'Bản đồ giúp bạn hình dung thứ tự học. Mỗi chặng bên dưới nêu kiến thức cần có và bài thực hành để tự kiểm tra trước khi học tiếp.'
          : 'The map shows the learning sequence. Each stage below lists prerequisites and a practical checkpoint to help you decide when to move on.'}</p>
        <p className="roadmap-overview-note">{vi
          ? 'Ảnh tóm tắt các phase lõi; danh sách bên dưới thêm bước bắt đầu và portfolio. Hoàn thành một mốc không đồng nghĩa đã thành thạo: hãy lưu code, output, test và ghi chú giới hạn.'
          : 'The image summarizes the core phases; the list below adds onboarding and portfolio. A checkpoint is not mastery: save code, output, tests and limitations as evidence.'}</p>
        <a href="#roadmap-paths">{vi ? 'Chọn hướng học phù hợp' : 'Choose your learning path'} ↓</a>
      </div>
      <figure className="roadmap-image-card">
        <img src="/images/roadmap/ai-engineer-roadmap.jpg" width={1376} height={768}
          alt={vi ? 'Bản đồ trực quan các chặng học AI Engineer' : 'Visual map of the AI Engineer learning stages'} />
        <figcaption>{vi ? 'Bản đồ trực quan · Mở ảnh lớn để xem chi tiết' : 'Visual map · Open the large image for detail'}
          <a href="/images/roadmap/ai-engineer-roadmap.jpg" target="_blank" rel="noreferrer">
            {vi ? 'Mở ảnh' : 'Open image'} ↗
          </a>
        </figcaption>
      </figure>
    </div>
    <section className="roadmap-stage-list" aria-labelledby="roadmap-stage-title">
      <div className="roadmap-section-heading">
        <span className="eyebrow">01 · {vi ? 'ĐƯỜNG HỌC CHÍNH' : 'THE LEARNING ARC'}</span>
        <h3 id="roadmap-stage-title">{vi ? 'Học từ đâu tới đâu?' : 'Where do you start and where do you go?'}</h3>
        <p>{vi ? 'Mở từng chặng để xem điều kiện bắt đầu và sản phẩm cần tạo.'
          : 'Open each stage to see its starting point and the evidence you should create.'}</p>
      </div>
      <div className="public-track-filter" role="group" aria-label={vi ? 'Lọc nền tảng và chuyên sâu' : 'Filter by track'}>
        {(['all', 'core', 'specialization'] as const).map((item) => <button key={item}
          data-public-track-filter={item} aria-pressed={track === item} onClick={() => setTrackFilter(item)}>
          {item === 'all' ? (vi ? 'Tất cả' : 'All tracks') : item === 'core'
            ? (vi ? 'Nền tảng' : 'Core') : (vi ? 'Chuyên sâu' : 'Specialization')}
        </button>)}
      </div>
      <ol>
        {stages.map((stage) => <li key={stage.id} className="roadmap-stage-card">
          <div className="roadmap-stage-number">{stage.number}</div>
          <div className="roadmap-stage-body">
            <span className={`roadmap-stage-track ${stage.track}`}>{stage.track === 'core'
              ? (vi ? 'Nền tảng' : 'Core') : (vi ? 'Chuyên sâu' : 'Specialization')}</span>
            <h4>{vi ? stage.title_vi : stage.title_en}</h4>
            <p>{vi ? stage.purpose.vi : stage.purpose.en}</p>
            <details>
              <summary>{vi ? 'Xem điều kiện và bằng chứng' : 'See prerequisites and evidence'}</summary>
              <dl>
                <dt>{vi ? 'Hướng bắt buộc' : 'Required for routes'}</dt>
                <dd>{stage.required_for_routes.length ? stage.required_for_routes.join(', ') : (vi ? 'Mở rộng tùy chọn' : 'Optional extension')}</dd>
                <dt>{vi ? 'Điều kiện trước' : 'Prerequisites'}</dt>
                <dd>{vi ? stage.prerequisites.vi : stage.prerequisites.en}</dd>
                <dt>{vi ? 'Khối lượng ước tính' : 'Estimated workload'}</dt>
                <dd>{stage.estimated_weeks} {vi ? 'tuần' : 'weeks'}</dd>
                <dt>{vi ? 'Dự án liên quan' : 'Related projects'}</dt>
                <dd>{stage.project_slugs.length ? stage.project_slugs.join(', ') : (vi ? 'Chưa có dự án riêng' : 'No dedicated project')}</dd>
                <dt>{vi ? 'Tiêu chí đầu ra' : 'Exit criteria'}</dt>
                <dd>{vi ? stage.exit_criteria.vi : stage.exit_criteria.en}</dd>
                <dt>{vi ? 'Bằng chứng cần có' : 'Evidence required'}</dt>
                <dd><ul>{(vi ? stage.evidence_required.vi : stage.evidence_required.en).map((item) => <li key={item}>{item}</li>)}</ul></dd>
              </dl>
            </details>
          </div>
        </li>)}
      </ol>
    </section>
    <div className="roadmap-section-heading roadmap-route-heading">
      <span className="eyebrow">02 · {vi ? 'CHỌN NHỊP HỌC' : 'CHOOSE YOUR PACE'}</span>
      <h3 id="roadmap-paths">{vi ? 'Chọn hướng học phù hợp với điểm xuất phát.' : 'Choose a path that matches your starting point.'}</h3>
    </div>
    <div className="route-choices" role="group" aria-label={vi ? 'Hướng học' : 'Learning direction'}>
      {routes.routes.map((item) => <button key={item.id} aria-pressed={selected === item.id}
        onClick={() => {
          setSelected(item.id)
          const url = new URL(window.location.href)
          url.searchParams.set('route', item.id)
          window.history.replaceState(window.history.state, '', url)
        }}>{vi ? item.title_vi : item.title_en}</button>)}
    </div>
    <p>{vi ? route.audience_vi : route.audience_en}</p>
    <p><strong>{vi ? 'Sản phẩm đầu ra: ' : 'Your outcome: '}</strong>{vi ? route.outcome_vi : route.outcome_en}</p>
    <ol className="route-phases">
      {route.phase_ids.map((id) => {
        const phase = curriculum.phases.find((item) => item.slug === id)!
        return <li key={id}>
          <LearningIllustration name={illustrationForLesson(id)} variant="thumbnail" />
    <details>
            <summary>{vi ? phase.title_vi : phase.title_en}</summary>
            <ul>{phase.modules.map((module) => <li key={module.slug}>
              {vi ? module.title_vi : module.title_en}
            </li>)}</ul>
          </details>
        </li>
      })}
    </ol>
    <p>{vi ? route.next_vi : route.next_en}</p>
    <p className="public-footnote">{route.weekly_hours.join('–')} {vi ? 'giờ/tuần' : 'hours/week'}.{' '}
      {vi ? routes.workload_note_vi : routes.workload_note_en}</p>
    <button className="public-primary" onClick={onStart}>
      {vi ? 'Bắt đầu với bài học mẫu' : 'Start with a sample lesson'} →
    </button>
  </section>
}
