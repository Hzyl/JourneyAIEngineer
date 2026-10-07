import curriculumPayload from '../../../content/curriculum.json'
import { catalogExercises } from './exercise-catalog'
import lessonPayload from '../../../content/lessons.json'
import moduleGuidePayload from '../../../content/module_guides.json'
import resourcePayload from '../../../content/resources.json'
import toolPayload from '../../../content/tools.json'

export type CatalogLesson = (typeof lessonPayload.lessons)[number] & {
  quality_status: 'draft' | 'reviewed'
  reviewed_at?: string
  completion_checklist_en?: string[]
  completion_criteria_en?: string[]
  common_mistakes_en?: string[]
}

const curated = import.meta.glob<CatalogLesson>('../../../content/curated/*.json', {
  eager: true,
  import: 'default',
})
const overlays = new Map(Object.values(curated).map((lesson) => [lesson.lesson_id, lesson]))
const lessons: CatalogLesson[] = lessonPayload.lessons.map((lesson) => (
  overlays.get(lesson.lesson_id) ?? { ...lesson, quality_status: 'draft' }
))

const lessonsBySlug = new Map<string, CatalogLesson>(
  lessons.map((lesson) => [lesson.lesson_id, lesson]),
)

export const hostedCatalog = {
  program: curriculumPayload.program,
  phases: curriculumPayload.phases,
  exercises: catalogExercises,
  resources: resourcePayload.resources,
  tools: toolPayload,
  moduleGuides: moduleGuidePayload.modules,
  lessons,
  lessonBySlug(slug: string): CatalogLesson | undefined {
    return lessonsBySlug.get(slug)
  },
  reviewCards() {
    return lessons.flatMap((lesson) => lesson.review_cards.map((card) => ({
      ...card,
      lesson_slug: lesson.lesson_id,
      phase_id: lesson.phase_id,
      module_id: lesson.module_id,
      title_vi: lesson.title_vi,
      title_en: lesson.title_en,
    })))
  },
} as const
