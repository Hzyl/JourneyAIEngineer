import type lessonPayload from '../../../content/lessons.json'
import type { CodeExample } from '../../api'

type CatalogCodeExample = Omit<
  (typeof lessonPayload.lessons)[number]['code_examples'][number],
  'setup_vi' | 'setup_en'
> & Pick<CodeExample, 'setup_vi' | 'setup_en'>

export type CatalogLesson = Omit<(typeof lessonPayload.lessons)[number], 'code_examples'> & {
  code_examples: CatalogCodeExample[]
  quality_status: 'draft' | 'reviewed'
  reviewed_at?: string
  completion_checklist_en?: string[]
  completion_criteria_en?: string[]
  common_mistakes_en?: string[]
}

export type CatalogLessonIndex = Pick<CatalogLesson,
  'lesson_id' | 'phase_id' | 'module_id' | 'title_vi' | 'title_en'
  | 'summary_vi' | 'summary_en' | 'estimated_minutes' | 'key_terms'
> & { review_cards: Array<Pick<CatalogLesson['review_cards'][number], 'id' | 'type'>> }

export type LessonPhaseLoaders = Record<string, () => Promise<{ default: CatalogLesson[] }>>
