import { useState } from 'react'
import curriculum from '../../content/curriculum.json'
import routes from '../../content/learning_routes.json'

type Props = { language: 'vi' | 'en'; standalone?: boolean; onStart: () => void }

export function PublicRoadmap({ language, standalone, onStart }: Props) {
  const [selected, setSelected] = useState(() => {
    const requested = new URLSearchParams(window.location.search).get('route')
    return routes.routes.some((route) => route.id === requested) ? requested! : 'foundation'
  })
  const vi = language === 'vi'
  const Heading = standalone ? 'h1' : 'h2'
  const route = routes.routes.find((item) => item.id === selected)!
  return <section className="public-roadmap" id="roadmap" aria-labelledby="route-title">
    <span className="eyebrow">{vi ? 'LỘ TRÌNH CỦA BẠN' : 'YOUR LEARNING PATH'}</span>
    <Heading id="route-title">{vi ? 'Chọn đích đến. Bắt đầu vừa sức.' : 'Choose a direction. Start at your level.'}</Heading>
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
