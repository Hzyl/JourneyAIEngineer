import { LearningIllustration } from './LearningIllustration'
import { illustrationForLesson } from './learning-illustrations'
import type { RoadmapGroup, RoadmapSection } from './roadmap-organization'

type Props = {
  group: RoadmapGroup
  language: 'vi' | 'en'
  index: number
  coreIds: Set<string>
  routeSelected: boolean
  revealMatches: boolean
  onOpenLesson: (slug: string) => void
}

export function RoadmapTopic({ group, language, index, coreIds, routeSelected, revealMatches, onOpenLesson }: Props) {
  const vi = language === 'vi'
  const { stage, sections } = group
  const phaseContent = ({ phase, kind }: RoadmapSection) => <section className="phase-block"
    data-phase-id={phase.slug} data-phase-track={coreIds.has(phase.slug) ? 'core' : 'specialization'}>
    <header className="phase-header">
      <LearningIllustration name={illustrationForLesson(phase.slug)} variant="thumbnail" />
      <h3>{kind === 'review' ? (vi ? `Ôn tập: ${stage.title_vi}` : `Review: ${stage.title_en}`)
        : (vi ? phase.title_vi : phase.title_en)}</h3>
      <span className="phase-track">{kind === 'review' ? (vi ? 'Ôn tập tùy chọn' : 'Optional review')
        : kind === 'bridge' ? (vi ? 'Cầu nối' : 'Bridge')
          : coreIds.has(phase.slug) ? (vi ? 'Nền tảng' : 'Core') : (vi ? 'Chuyên sâu' : 'Specialization')}</span>
    </header>
    {phase.modules.map((module) => <div className="module-block" key={module.slug}>
      <h4 className="module-title">{vi ? module.title_vi : module.title_en}</h4>
      {module.lessons.map((lesson) => <button className={`lesson-row ${lesson.status === 'completed' ? 'done' : ''}`}
        key={lesson.slug} data-lesson-id={lesson.slug} onClick={() => onOpenLesson(lesson.slug)}>
        <span className="lesson-check" aria-hidden="true">{lesson.status === 'completed' ? '✓' : '○'}</span>
        <span>{vi ? lesson.title_vi : lesson.title_en}</span><small>{lesson.estimated_minutes}m</small>
      </button>)}
    </div>)}
  </section>

  return <section className="roadmap-topic" data-topic={stage.id}>
    <h2 className="roadmap-topic-title"><span className="phase-index">{String(index + 1).padStart(2, '0')}</span>
      {vi ? stage.title_vi : stage.title_en}</h2>
    {(stage.note_vi || stage.note_en) && <p className="roadmap-topic-note">{vi ? stage.note_vi : stage.note_en}</p>}
    {sections.map((section) => {
      const { phase, kind } = section
      if (kind === 'main') return <div key={phase.slug}>{phaseContent(section)}</div>
      const count = phase.modules.reduce((total, module) => total + module.lessons.length, 0)
      const label = kind === 'review' ? (vi ? 'Ôn tập kiến thức đã có' : 'Review existing concepts')
        : kind === 'bridge' ? (vi ? 'Cầu nối cho hướng ứng dụng' : 'Bridge for the application path')
          : (vi ? 'Mở rộng tùy chọn' : 'Optional extension')
      return <details className="roadmap-supplement" key={`${kind}-${phase.slug}`} data-section-kind={kind}
        open={revealMatches || (routeSelected && kind === 'bridge')}>
        <summary>{label}{kind !== 'review' && <> · {vi ? phase.title_vi : phase.title_en}</>} · {count} {vi ? 'bài' : 'lessons'}</summary>
        {kind === 'review' && <p>{vi
          ? 'Các bài khảo sát cũ được gom về đúng chủ đề. Bạn không cần học lại nếu đã đạt checkpoint; tiến độ cũ vẫn được giữ.'
          : 'Earlier survey lessons are grouped by topic. Revisit only what you need for the checkpoint; existing progress is preserved.'}</p>}
        {phaseContent(section)}
      </details>
    })}
  </section>
}
