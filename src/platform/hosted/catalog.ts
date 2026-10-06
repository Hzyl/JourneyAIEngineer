import curriculumPayload from '../../../content/curriculum.json'
import exercisePayload from '../../../content/exercises.json'
import lessonPayload from '../../../content/lessons.json'
import moduleGuidePayload from '../../../content/module_guides.json'
import resourcePayload from '../../../content/resources.json'
import toolPayload from '../../../content/tools.json'

type CatalogLesson = (typeof lessonPayload.lessons)[number]

const lessonsBySlug = new Map<string, CatalogLesson>(
  lessonPayload.lessons.map((lesson) => [lesson.lesson_id, lesson]),
)

export const hostedCatalog = {
  program: curriculumPayload.program,
  phases: curriculumPayload.phases,
  exercises: exercisePayload.exercises,
  resources: resourcePayload.resources,
  tools: toolPayload,
  moduleGuides: moduleGuidePayload.modules,
  lessons: lessonPayload.lessons,
  lessonBySlug(slug: string): CatalogLesson | undefined {
    return lessonsBySlug.get(slug)
  },
  reviewCards() {
    return lessonPayload.lessons.flatMap((lesson) => lesson.review_cards.map((card) => ({
      ...card,
      lesson_slug: lesson.lesson_id,
      phase_id: lesson.phase_id,
      module_id: lesson.module_id,
      title_vi: lesson.title_vi,
      title_en: lesson.title_en,
    })))
  },
} as const
