import type { AppSettings, Dashboard, Lesson, ReferenceResource, SearchResult } from '../../api'
import { hostedCapabilities } from '../capabilities'
import { hostedCatalog } from './catalog'
import { countLocalStreak } from './learning-state'
import { requireHostedUser, requireSupabase } from './supabase-client'

const defaults: AppSettings = {
  language: 'vi',
  track: 'standard',
  weekly_goal_minutes: 720,
  show_completed_lessons: true,
  target_role: 'internship',
  experience_level: 'beginner',
  onboarding_complete: false,
}

type ProgressRow = { lesson_slug: string; status: string; minutes_spent: number; completed_at: string | null; updated_at: string }
type SessionRow = { id: string; lesson_slug: string | null; minutes: number; note: string; studied_at: string; created_at: string }
type ReviewStateRow = { card_id: string; lesson_slug: string; due_at: string; interval_days: number; repetitions: number; ease_factor: number; lapses: number; leech: boolean; suspended: boolean; last_reviewed_at: string | null }

function errorMessage(error: { message?: string } | null): never {
  throw new Error(error?.message || 'Không thể đồng bộ dữ liệu học.')
}

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase()
}

function moduleMeta(phaseId: string, moduleId: string) {
  const phase = hostedCatalog.phases.find((item) => item.slug === phaseId)
  const module = phase?.modules.find((item) => item.slug === moduleId)
  return { phase, module }
}

function lessonStatus(progress: Map<string, ProgressRow>, slug: string): ProgressRow {
  return progress.get(slug) ?? { lesson_slug: slug, status: 'not_started', minutes_spent: 0, completed_at: null, updated_at: '' }
}

async function selectRows<T>(table: string, columns: string): Promise<T[]> {
  await requireHostedUser()
  const { data, error } = await requireSupabase().from(table).select(columns)
  if (error) errorMessage(error)
  return (data ?? []) as T[]
}

async function readSettings(): Promise<AppSettings> {
  const user = await requireHostedUser()
  const client = requireSupabase()
  const { data, error } = await client
    .from('user_settings')
    .select('language,track,weekly_goal_minutes,show_completed_lessons,target_role,experience_level,onboarding_complete')
    .eq('user_id', user.id)
    .maybeSingle()
  if (error) errorMessage(error)
  if (!data) {
    const { data: inserted, error: insertError } = await client
      .from('user_settings')
      .insert({ user_id: user.id })
      .select('language,track,weekly_goal_minutes,show_completed_lessons,target_role,experience_level,onboarding_complete')
      .single()
    if (insertError) errorMessage(insertError)
    return { ...defaults, ...(inserted as Partial<AppSettings>) }
  }
  return { ...defaults, ...(data as Partial<AppSettings>) }
}

async function readLearningState() {
  const [progress, sessions, reviewState, settings] = await Promise.all([
    selectRows<ProgressRow>('lesson_progress', 'lesson_slug,status,minutes_spent,completed_at,updated_at'),
    selectRows<SessionRow>('study_sessions', 'id,lesson_slug,minutes,note,studied_at,created_at'),
    selectRows<ReviewStateRow>('review_state', 'card_id,lesson_slug,due_at,interval_days,repetitions,ease_factor,lapses,leech,suspended,last_reviewed_at'),
    readSettings(),
  ])
  return { progress, sessions, reviewState, settings }
}

function roadmapWithProgress(progressRows: ProgressRow[]) {
  const progress = new Map(progressRows.map((item) => [item.lesson_slug, item]))
  return hostedCatalog.phases.map((phase) => ({
    ...phase,
    modules: phase.modules.map((module) => ({
      ...module,
      lessons: module.lessons.map((_title, index) => {
        const slug = `${phase.slug}-${module.slug}-${index + 1}`
        const lesson = hostedCatalog.lessonBySlug(slug)
        const current = lessonStatus(progress, slug)
        return {
          slug,
          title_vi: lesson?.title_vi ?? _title,
          title_en: lesson?.title_en ?? _title,
          estimated_minutes: lesson?.estimated_minutes ?? 45,
          status: current.status,
          minutes_spent: current.minutes_spent,
        }
      }),
    })),
  }))
}

function makeLesson(slug: string, progressRows: ProgressRow[]): Lesson {
  const source = hostedCatalog.lessonBySlug(slug)
  if (!source) throw new Error('Không tìm thấy lesson này trong curriculum được phát hành.')
  const { phase, module } = moduleMeta(source.phase_id, source.module_id)
  const state = lessonStatus(new Map(progressRows.map((item) => [item.lesson_slug, item])), slug)
  const exercises = hostedCatalog.exercises.filter((item) => item.module_id === source.module_id)
  return {
    slug,
    title_vi: source.title_vi,
    title_en: source.title_en,
    summary_vi: source.summary_vi,
    summary_en: source.summary_en,
    objectives: { vi: source.learning_objectives, en: source.learning_objectives_en },
    learning_objectives: { vi: source.learning_objectives, en: source.learning_objectives_en },
    prerequisites: source.prerequisites,
    keywords: source.key_terms,
    key_terms: source.key_terms,
    concept_notes_vi: source.concept_notes_vi,
    concept_notes_en: source.concept_notes_en,
    formulas: source.formulas,
    code_examples: source.code_examples as Lesson['code_examples'],
    resources: source.resources as Lesson['resources'],
    checklist: source.completion_checklist,
    completion_checklist: source.completion_checklist,
    completion_criteria: source.completion_criteria,
    common_mistakes: source.common_mistakes,
    next_lessons: source.next_lessons,
    exercise_ids: source.exercise_ids,
    review_item_ids: source.review_item_ids,
    estimated_minutes: source.estimated_minutes,
    status: state.status,
    minutes_spent: state.minutes_spent,
    phase_title_vi: phase?.title_vi ?? source.phase_id,
    phase_title_en: phase?.title_en ?? source.phase_id,
    module_title_vi: module?.title_vi ?? source.module_id,
    module_title_en: module?.title_en ?? source.module_id,
    reviews: source.review_cards.map((card) => ({ ...card, id: card.id })),
    exercises: exercises as Lesson['exercises'],
    why_it_matters_vi: source.why_it_matters_vi,
    why_it_matters_en: source.why_it_matters_en,
    study_steps_vi: source.study_steps_vi,
    study_steps_en: source.study_steps_en,
    practice_plan: source.practice_plan,
    interview_questions: source.interview_questions,
    guide: {
      why_it_matters_vi: source.why_it_matters_vi,
      why_it_matters_en: source.why_it_matters_en,
      study_steps_vi: source.study_steps_vi,
      study_steps_en: source.study_steps_en,
      practice_plan: source.practice_plan,
      interview_questions: source.interview_questions,
    },
  }
}

function download(filename: string, content: string, type: string) {
  const link = document.createElement('a')
  const url = URL.createObjectURL(new Blob([content], { type }))
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

const localOnlyError = async () => {
  throw new Error('Tính năng này chỉ có trong portable hoặc source clone chạy trên máy của bạn.')
}

export const hostedApi = {
  capabilities: hostedCapabilities,
  health: async () => ({ status: 'ok', project_root_configured: false, git_publish_available: false, local_only: false, mode: 'hosted' as const }),
  dashboard: async (): Promise<Dashboard> => {
    const { progress, sessions, reviewState, settings } = await readLearningState()
    const roadmap = roadmapWithProgress(progress)
    const lessons = roadmap.flatMap((phase) => phase.modules.flatMap((module) => module.lessons))
    const completed = lessons.filter((lesson) => lesson.status === 'completed')
    const inProgress = lessons.filter((lesson) => lesson.status === 'in_progress')
    const now = new Date()
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const weeklySessions = sessions.filter((item) => new Date(item.studied_at) >= weekStart)
    const current = lessons.find((lesson) => lesson.status !== 'completed')
    const currentCatalogLesson = current ? hostedCatalog.lessonBySlug(current.slug) : undefined
    const currentMeta = currentCatalogLesson ? moduleMeta(currentCatalogLesson.phase_id, currentCatalogLesson.module_id) : undefined
    return {
      total_lessons: lessons.length,
      completed_lessons: completed.length,
      in_progress_lessons: inProgress.length,
      progress_percent: lessons.length ? Math.round((completed.length / lessons.length) * 1000) / 10 : 0,
      due_reviews: hostedCatalog.reviewCards().filter((card) => {
        const state = reviewState.find((item) => item.card_id === card.id)
        return !state || (!state.suspended && new Date(state.due_at) <= now)
      }).length,
      study_minutes: sessions.reduce((sum, item) => sum + item.minutes, 0),
      weekly_minutes: weeklySessions.reduce((sum, item) => sum + item.minutes, 0),
      weekly_goal_minutes: settings.weekly_goal_minutes,
      lessons_this_week: completed.filter((item) => {
        const row = progress.find((value) => value.lesson_slug === item.slug)
        return row?.completed_at ? new Date(row.completed_at) >= weekStart : false
      }).length,
      streak_days: countLocalStreak(sessions, now),
      current_lesson: current ? {
        slug: current.slug,
        title_vi: current.title_vi,
        module_title: currentMeta?.module?.title_vi ?? '',
        phase_title: currentMeta?.phase?.title_vi ?? '',
      } : null,
      phases: roadmap.map((phase) => {
        const phaseLessons = phase.modules.flatMap((module) => module.lessons)
        return { slug: phase.slug, title_vi: phase.title_vi, duration_weeks: phase.duration_weeks, lessons: phaseLessons.length, completed: phaseLessons.filter((item) => item.status === 'completed').length }
      }),
    }
  },
  roadmap: async () => {
    const progress = await selectRows<ProgressRow>('lesson_progress', 'lesson_slug,status,minutes_spent,completed_at,updated_at')
    return { program: hostedCatalog.program, phases: roadmapWithProgress(progress) }
  },
  resources: async () => ({ resources: hostedCatalog.resources as ReferenceResource[], count: hostedCatalog.resources.length, total: hostedCatalog.resources.length }),
  tools: async () => ({ tools: hostedCatalog.tools }),
  exercises: async () => ({ exercises: hostedCatalog.exercises.map((item) => ({ ...item, workspace_id: null, workspace_path: null })) }),
  search: async (query: string, options: { type?: string; phase?: string; status?: string; limit?: number } = {}) => {
    const needle = normalize(query.trim())
    if (!needle) return { results: [], count: 0, query }
    const progress = await selectRows<ProgressRow>('lesson_progress', 'lesson_slug,status,minutes_spent,completed_at,updated_at')
    const progressBySlug = new Map(progress.map((item) => [item.lesson_slug, item]))
    const result: SearchResult[] = []
    for (const lesson of hostedCatalog.lessons) {
      const text = normalize([lesson.title_vi, lesson.title_en, lesson.summary_vi, lesson.summary_en, ...lesson.key_terms].join(' '))
      if (text.includes(needle) && (!options.phase || options.phase === 'all' || lesson.phase_id === options.phase) && (!options.status || options.status === 'all' || lessonStatus(progressBySlug, lesson.lesson_id).status === options.status)) {
        result.push({ type: 'lesson', id: lesson.lesson_id, slug: lesson.lesson_id, title: lesson.title_vi, subtitle: lesson.summary_vi, phase: lesson.phase_id })
      }
    }
    for (const resource of hostedCatalog.resources) {
      if (normalize([resource.title_vi, resource.title_en, resource.provider, resource.description_vi].join(' ')).includes(needle)) result.push({ type: 'resource', id: resource.slug, title: resource.title_vi, subtitle: resource.provider, phase: resource.phase_ids, url: resource.url })
    }
    const limit = Math.max(1, Math.min(options.limit ?? 25, 50))
    return { results: result.slice(0, limit), count: result.length, query }
  },
  feedback: async () => ({ items: [], count: 0 }),
  createFeedback: async (payload: { lesson_slug: string; kind: string; body: string; display_name?: string }) => ({
    feedback: { id: Date.now(), lesson_slug: payload.lesson_slug, lesson_title_vi: payload.lesson_slug, lesson_title_en: payload.lesson_slug, kind: payload.kind, body: payload.body, status: 'drafted', display_name: payload.display_name ?? null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    message: 'Web beta sẽ mở GitHub Issues để thu thập góp ý sau khi repository được public.',
  }),
  securityAudit: async () => ({ mode: 'passive', safe_mode: true, network_requests: 0, payloads_sent: 0, external_tools: [], source_root: '', route_count: 0, routes: [], findings: [], summary: { status_counts: {}, severity_counts: {}, candidate_count: 0, needs_human_review: 0, verified_controls: 0 }, limitations_vi: ['Security Lab chỉ chạy trong desktop/local mode.'] }),
  lesson: async (slug: string) => makeLesson(slug, await selectRows<ProgressRow>('lesson_progress', 'lesson_slug,status,minutes_spent,completed_at,updated_at')),
  updateProgress: async (slug: string, status: string, minutesSpent = 0) => {
    const { error } = await requireSupabase().rpc('record_lesson_progress', { p_lesson_slug: slug, p_status: status, p_minutes: minutesSpent })
    if (error) errorMessage(error)
    return { slug, status, minutes_added: minutesSpent }
  },
  createSession: async (payload: { lesson_slug?: string; minutes: number; note?: string }) => {
    const user = await requireHostedUser()
    const { error } = await requireSupabase().from('study_sessions').insert({ user_id: user.id, lesson_slug: payload.lesson_slug ?? null, minutes: payload.minutes, note: payload.note ?? '' })
    if (error) errorMessage(error)
    return { status: 'recorded' }
  },
  reviews: async () => {
    const state = await selectRows<ReviewStateRow>('review_state', 'card_id,lesson_slug,due_at,interval_days,repetitions,ease_factor,lapses,leech,suspended,last_reviewed_at')
    const byCard = new Map(state.map((item) => [item.card_id, item]))
    const now = new Date()
    const items = hostedCatalog.reviewCards().filter((card) => {
      const item = byCard.get(card.id)
      return !item || (!item.suspended && new Date(item.due_at) <= now)
    }).slice(0, 30).map((card) => ({
      ...card,
      id: card.id,
      phase_title_vi: moduleMeta(card.phase_id, card.module_id).phase?.title_vi ?? card.phase_id,
      related_exercise: hostedCatalog.exercises.find((item) => item.module_id === card.module_id)?.slug ?? null,
      ...(byCard.get(card.id) ?? { due_at: now.toISOString(), interval_days: 0, repetitions: 0, ease_factor: 2.5, lapses: 0, leech: false, suspended: false, last_reviewed_at: null }),
    }))
    return { items, count: items.length }
  },
  answerReview: async (id: string | number, rating: string, thoughtSeconds = 0, answerText = '') => {
    const card = hostedCatalog.reviewCards().find((item) => item.id === id)
    if (!card) throw new Error('Không tìm thấy review card.')
    const { data, error } = await requireSupabase().rpc('answer_review_card', { p_card_id: card.id, p_lesson_slug: card.lesson_slug, p_rating: rating, p_thought_seconds: thoughtSeconds, p_answer_text: answerText })
    if (error) errorMessage(error)
    return data
  },
  reviewHistory: async () => {
    const rows = await selectRows<any>('review_history', 'id,card_id,lesson_slug,rating,thought_seconds,answer_text,reviewed_at,interval_days,ease_factor,repetitions,lapses')
    const cards = new Map(hostedCatalog.reviewCards().map((card) => [card.id, card]))
    const items = rows.sort((a, b) => new Date(b.reviewed_at).getTime() - new Date(a.reviewed_at).getTime()).slice(0, 50).map((row) => ({ ...row, created_at: row.reviewed_at, lesson_title_vi: cards.get(row.card_id)?.title_vi ?? row.lesson_slug }))
    return { items, count: items.length }
  },
  weakTopics: async () => {
    const { items } = await hostedApi.reviewHistory()
    const aggregate = new Map<string, { lesson_slug: string; title_vi: string; attempts: number; hard_attempts: number; last_reviewed_at: string }>()
    for (const row of items) {
      const current = aggregate.get(row.lesson_slug) ?? { lesson_slug: row.lesson_slug, title_vi: row.lesson_title_vi, attempts: 0, hard_attempts: 0, last_reviewed_at: row.created_at }
      current.attempts += 1
      if (row.rating === 'again' || row.rating === 'hard') current.hard_attempts += 1
      aggregate.set(row.lesson_slug, current)
    }
    return { items: [...aggregate.values()].sort((a, b) => b.hard_attempts - a.hard_attempts || b.attempts - a.attempts).slice(0, 12) }
  },
  settings: readSettings,
  updateSettings: async (payload: Partial<AppSettings>) => {
    const user = await requireHostedUser()
    const { data, error } = await requireSupabase().from('user_settings').upsert({ user_id: user.id, ...payload }).select('language,track,weekly_goal_minutes,show_completed_lessons,target_role,experience_level,onboarding_complete').single()
    if (error) errorMessage(error)
    return { ...defaults, ...(data as Partial<AppSettings>) }
  },
  notes: async () => ({ notes: (await selectRows<any>('notes', 'id,lesson_slug,title,body,created_at,updated_at')).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()) }),
  createNote: async (payload: { lesson_slug?: string; title: string; body: string }) => {
    const user = await requireHostedUser()
    const { data, error } = await requireSupabase().from('notes').insert({ user_id: user.id, lesson_slug: payload.lesson_slug ?? null, title: payload.title, body: payload.body }).select('id,lesson_slug,title,body,created_at,updated_at').single()
    if (error) errorMessage(error)
    return data
  },
  journalEntries: async () => ({ entries: (await selectRows<any>('journal_entries', 'id,week_start,title,body,created_at,updated_at')).sort((a, b) => String(b.week_start).localeCompare(String(a.week_start))) }),
  upsertJournalEntry: async (payload: { week_start: string; title: string; body: string }) => {
    const user = await requireHostedUser()
    const title = payload.title.trim()
    const body = payload.body.trim()
    if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.week_start)) throw new Error('Ngày bắt đầu tuần không hợp lệ.')
    if (!title || title.length > 200 || body.length > 50_000) throw new Error('Journal cần tiêu đề (tối đa 200 ký tự) và nội dung tối đa 50.000 ký tự.')
    const { data, error } = await requireSupabase().from('journal_entries')
      .upsert({ user_id: user.id, week_start: payload.week_start, title, body }, { onConflict: 'user_id,week_start' })
      .select('id,week_start,title,body,created_at,updated_at').single()
    if (error) errorMessage(error)
    return data
  },
  gitStatus: async () => ({ root: '', branch: '', status: '', remote: '', last_commit: '' }),
  gitDiff: async () => ({ diff: '' }),
  suggestedCommit: async () => ({ message: 'Dùng source clone để review và commit Git.', files: [], requires_confirmation: false }),
  publishGit: localOnlyError,
  exportJournal: async () => {
    const notes = await selectRows<any>('notes', 'lesson_slug,title,body,updated_at')
    const markdown = `# Journey AI Engineer — web journal\n\n${notes.map((note) => `## ${note.title}\n\n${note.body}\n`).join('\n')}`
    download('journey-ai-engineer-web-journal.md', markdown, 'text/markdown')
    return { path: 'Đã tải file Markdown trong trình duyệt', week: '' }
  },
  exportContext: async (payload: { lesson_slug?: string; exercise_slug?: string; question: string }) => {
    const lesson = payload.lesson_slug ? hostedCatalog.lessonBySlug(payload.lesson_slug) : null
    const content = `# Context học tập\n\n## Câu hỏi\n${payload.question}\n\n## Lesson\n${lesson ? `${lesson.title_vi} (${lesson.lesson_id})\n${lesson.summary_vi}` : 'Chưa chọn lesson'}\n\nHãy hướng dẫn từng bước, không đưa đáp án hoàn chỉnh ngay.`
    return { path: 'Context chỉ nằm trong trình duyệt', content }
  },
  exportBackup: localOnlyError,
  previewBackup: localOnlyError,
  importBackup: localOnlyError,
  runtimeHeartbeat: async () => ({ ok: true, active_clients: 0 }),
  runtimeDisconnect: async () => ({ ok: true, active_clients: 0 }),
  createWorkspace: localOnlyError,
  openWorkspace: localOnlyError,
  openFolder: localOnlyError,
  exportWorkspace: localOnlyError,
  runWorkspace: localOnlyError,
  workspaceRuns: async () => ({ runs: [], count: 0 }),
} as const
