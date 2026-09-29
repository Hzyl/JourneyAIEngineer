// A relative API path works for the packaged desktop app and is proxied by Vite during development.
const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'

export type Dashboard = {
  total_lessons: number
  completed_lessons: number
  in_progress_lessons: number
  progress_percent: number
  due_reviews: number
  study_minutes: number
  weekly_minutes: number
  weekly_goal_minutes: number
  lessons_this_week: number
  streak_days: number
  current_lesson: { slug: string; title_vi: string; module_title: string; phase_title: string } | null
  phases: Array<{ slug: string; title_vi: string; duration_weeks: number; lessons: number; completed: number }>
}

export type PortfolioProject = {
  slug: string
  title_vi: string
  title_en: string
  phase_id: string
  problem_vi: string
  problem_en: string
  stack: string[]
  deliverables: string[]
  evaluation: string
  github_path: string
  estimated_weeks: number
}

export type ReferenceResource = {
  slug: string
  title_vi: string
  title_en: string
  provider: string
  url: string
  type: string
  language: string
  level: string
  official: boolean
  featured?: boolean
  phase_ids: string[]
  description_vi: string
  description_en: string
  how_to_use_vi: string
  how_to_use_en: string
}

export type SearchResult = {
  type: 'lesson' | 'phase' | 'module' | 'resource' | 'exercise' | string
  id: string
  title: string
  subtitle?: string
  slug?: string
  phase?: string | string[]
  url?: string
}

export type BackupPayload = {
  schema_version: number
  app_version: string
  exported_at: string
  settings: Record<string, string>
  progress: Array<Record<string, unknown>>
  review_state: Array<Record<string, unknown>>
  review_history: Array<Record<string, unknown>>
  notes: Array<Record<string, unknown>>
  study_sessions: Array<Record<string, unknown>>
  journal_files: Array<{ path: string; content: string }>
}

export type LessonPracticePlan = {
  vi?: { task?: string; deliverables?: string[]; checkpoint?: string; stretch?: string }
  en?: { task?: string; deliverables?: string[]; checkpoint?: string; stretch?: string }
}

export type LessonInterviewQuestions = { vi?: string[]; en?: string[] }

export type Lesson = {
  slug: string
  title_vi: string
  title_en: string
  summary_vi: string
  summary_en: string
  objectives: { vi: string[]; en: string[] }
  learning_objectives: { vi: string[]; en: string[] }
  prerequisites: string[]
  keywords: string[]
  key_terms?: string[]
  concept_notes_vi: string
  concept_notes_en: string
  formulas: string[]
  code_examples: Array<{ language: string; title: string; code: string; status?: 'runnable' | 'conceptual'; purpose_vi?: string; purpose_en?: string; setup?: string; expected_output?: string; edge_case_vi?: string; edge_case_en?: string; explanation_vi: string; explanation_en: string }>
  resources: Array<{
    title: string
    url: string
    language: string
    kind?: 'official' | 'in_app'
    required?: boolean
    purpose_vi?: string
    purpose_en?: string
    read_vi?: string
    read_en?: string
  }>
  checklist: string[]
  completion_checklist: string[]
  completion_criteria: string[]
  common_mistakes: string[]
  next_lessons: string[]
  exercise_ids: string[]
  review_item_ids: number[]
  estimated_minutes: number
  status: string
  minutes_spent: number
  phase_title_vi: string
  phase_title_en: string
  module_title_vi: string
  module_title_en: string
  reviews: Array<{ id: number; question_vi: string; question_en: string; answer_vi: string; answer_en: string }>
  exercises: Exercise[]
  why_it_matters_vi: string
  why_it_matters_en: string
  study_steps_vi: string[]
  study_steps_en: string[]
  study_step_refs?: Array<{ resource_index?: number; code_example_index?: number; review_id?: number; exercise_slugs?: string[] }>
  practice_plan: LessonPracticePlan
  interview_questions: LessonInterviewQuestions
  guide?: {
    why_it_matters_vi: string
    why_it_matters_en: string
    study_steps_vi: string[]
    study_steps_en: string[]
    practice_plan: LessonPracticePlan
    interview_questions: LessonInterviewQuestions
  }
}

export type Exercise = {
  id: number
  slug: string
  title_vi: string
  title_en: string
  description_vi: string
  description_en: string
  difficulty: string
  estimated_minutes: number
  test_command: string
  workspace_id?: number | null
  workspace_path?: string | null
  hints: string[]
}

export type WorkspaceExport = {
  workspace_id: number
  artifact_path: string
  files: string[]
  skipped: string[]
  secret_files: string[]
}

export type GitPublishResult = {
  committed: boolean
  pushed: boolean
  commit: string
  branch: string
  remote: string
  files: string[]
  message: string
}

export type AppSettings = {
  language: 'vi' | 'en'
  track: 'standard' | 'accelerated'
  weekly_goal_minutes: number
  show_completed_lessons: boolean
  target_role: 'internship' | 'junior' | 'career_switch'
  experience_level: 'beginner' | 'intermediate' | 'advanced'
  onboarding_complete: boolean
}

export type FeedbackKind = 'unclear' | 'incorrect' | 'missing_example' | 'missing_resource' | 'broken_link' | 'typo' | 'exercise_problem' | 'feature_request'

export type FeedbackItem = {
  id: number
  lesson_slug: string
  lesson_title_vi: string
  lesson_title_en: string
  kind: FeedbackKind
  body: string
  status: 'accepted' | 'implemented' | 'pending' | 'triaged' | 'rejected' | 'drafted'
  display_name: string | null
  created_at: string
  updated_at: string
}

export type SecurityFinding = {
  id: string
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  status: 'candidate' | 'needs_human_review' | 'verified_control'
  title_vi: string
  evidence: string
  remediation_vi: string
  path: string | null
  methods: string[]
  source_file: string | null
  source_line: number | null
}

export type SecurityAuditReport = {
  mode: 'passive'
  safe_mode: boolean
  network_requests: number
  payloads_sent: number
  external_tools: string[]
  source_root: string
  route_count: number
  routes: Array<{ path: string; methods: string[]; name: string; endpoint: string; operation_id: string | null; mutating: boolean; body_model: string | null; unbounded_string_fields: string[]; source_file: string | null; source_line: number | null }>
  findings: SecurityFinding[]
  summary: { status_counts: Record<string, number>; severity_counts: Record<string, number>; candidate_count: number; needs_human_review: number; verified_controls: number }
  limitations_vi: string[]
}

export type HealthStatus = { status: string; project_root_configured: boolean; git_publish_available: boolean; local_only: boolean }

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
    ...options,
  })
  if (!response.ok) {
    const message = await response.text()
    let detail = message
    try {
      const payload = JSON.parse(message) as { detail?: unknown }
      if (typeof payload.detail === 'string') detail = payload.detail
    } catch {
      // Keep the raw response when it is not JSON.
    }
    throw new Error(detail || `Request failed with ${response.status}`)
  }
  return response.json() as Promise<T>
}

export const api = {
  health: () => request<HealthStatus>('/health'),
  dashboard: () => request<Dashboard>('/dashboard'),
  roadmap: () => request<{ program: { title_vi: string; title_en: string; description_vi: string; description_en: string; standard_weeks: number; accelerated_weeks: number; portfolio_projects: PortfolioProject[]; career_checklist: string[] }; phases: any[] }>('/roadmap'),
  resources: () => request<{ resources: ReferenceResource[]; count: number; total: number }>('/resources'),
  search: (query: string, options?: { type?: string; phase?: string; status?: string; limit?: number }) => {
    const params = new URLSearchParams({ q: query })
    if (options?.type && options.type !== 'all') params.set('type', options.type)
    if (options?.phase && options.phase !== 'all') params.set('phase', options.phase)
    if (options?.status && options.status !== 'all') params.set('status', options.status)
    if (options?.limit) params.set('limit', String(options.limit))
    return request<{ results: SearchResult[]; count: number; query: string }>(`/search?${params.toString()}`)
  },
  feedback: (lessonSlug?: string) => request<{ items: FeedbackItem[]; count: number }>(`/feedback${lessonSlug ? `?lesson_slug=${encodeURIComponent(lessonSlug)}` : ''}`),
  createFeedback: (payload: { lesson_slug: string; kind: FeedbackKind; body: string; display_name?: string }) => request<{ feedback: FeedbackItem; message: string }>('/feedback', { method: 'POST', body: JSON.stringify(payload) }),
  securityAudit: () => request<SecurityAuditReport>('/security/audit'),
  lesson: (slug: string) => request<Lesson>(`/lessons/${slug}`),
  updateProgress: (slug: string, status: string, minutes_spent = 0) => request(`/lessons/${slug}/progress`, { method: 'PATCH', body: JSON.stringify({ status, minutes_spent }) }),
  createSession: (payload: { lesson_slug?: string; minutes: number; note?: string }) => request('/study-sessions', { method: 'POST', body: JSON.stringify(payload) }),
  reviews: () => request<{ items: Array<any>; count: number }>('/reviews/due'),
  answerReview: (id: number, rating: string, thoughtSeconds = 0, answerText = '') => request(`/reviews/${id}/answer`, { method: 'POST', body: JSON.stringify({ rating, thought_seconds: thoughtSeconds, answer_text: answerText }) }),
  reviewHistory: () => request<{ items: Array<any>; count: number }>('/reviews/history'),
  weakTopics: () => request<{ items: Array<any> }>('/reviews/weak-topics'),
  exercises: () => request<{ exercises: Exercise[] }>('/exercises'),
  createWorkspace: (slug: string) => request<{ workspace: { id: number; path: string }; created: boolean }>(`/exercises/${slug}/workspace`, { method: 'POST' }),
  openWorkspace: (id: number) => request<{ opened: boolean; path: string; message?: string }>(`/workspaces/${id}/open`, { method: 'POST' }),
  openFolder: (id: number) => request<{ opened: boolean; path: string; message?: string }>(`/workspaces/${id}/open-folder`, { method: 'POST' }),
  exportWorkspace: (id: number) => request<WorkspaceExport>(`/workspaces/${id}/export`, { method: 'POST' }),
  runWorkspace: (id: number) => request<{ status: string; output: string; duration_ms: number }>(`/workspaces/${id}/run`, { method: 'POST' }),
  workspaceRuns: (id: number) => request<{ runs: Array<any>; count: number }>(`/workspaces/${id}/runs`),
  tools: () => request<{ tools: Array<any> }>('/tools'),
  settings: () => request<AppSettings>('/settings'),
  updateSettings: (payload: Partial<AppSettings>) => request<AppSettings>('/settings', { method: 'PATCH', body: JSON.stringify(payload) }),
  notes: () => request<{ notes: Array<any> }>('/notes'),
  createNote: (payload: { lesson_slug?: string; title: string; body: string }) => request('/notes', { method: 'POST', body: JSON.stringify(payload) }),
  gitStatus: () => request<{ root: string; branch: string; status: string; remote: string; last_commit: string }>('/git/status'),
  gitDiff: () => request<{ diff: string }>('/git/diff'),
  suggestedCommit: () => request<{ message: string; files: string[]; requires_confirmation: boolean }>('/git/suggested-commit'),
  publishGit: (payload: { paths: string[]; message: string; confirm: boolean }) => request<GitPublishResult>('/git/publish', { method: 'POST', body: JSON.stringify(payload) }),
  exportJournal: () => request<{ path: string; week: string }>('/journal/export', { method: 'POST' }),
  exportContext: (payload: { lesson_slug?: string; exercise_slug?: string; question: string }) => request<{ path: string; content: string }>('/context/export', { method: 'POST', body: JSON.stringify(payload) }),
  exportBackup: () => request<{ payload: BackupPayload; json_path: string; markdown_path: string }>('/backup/export', { method: 'POST' }),
  previewBackup: (payload: BackupPayload) => request<{ valid: boolean; errors: string[]; counts: Record<string, number> }>('/backup/preview', { method: 'POST', body: JSON.stringify({ payload }) }),
  importBackup: (payload: BackupPayload) => request<{ imported: boolean; safety_backup_json: string; safety_backup_markdown: string; restored_journal_files: number }>('/backup/import', { method: 'POST', body: JSON.stringify({ payload, confirm: true }) }),
  runtimeHeartbeat: (clientId: string) => request<{ ok: boolean; active_clients: number }>('/runtime/heartbeat', { method: 'POST', body: JSON.stringify({ client_id: clientId }) }),
  runtimeDisconnect: (clientId: string) => {
    const body = JSON.stringify({ client_id: clientId })
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const accepted = navigator.sendBeacon(`${API_BASE}/runtime/disconnect`, new Blob([body], { type: 'application/json' }))
      if (accepted) return Promise.resolve({ ok: true, active_clients: 0 })
    }
    return request<{ ok: boolean; active_clients: number }>('/runtime/disconnect', { method: 'POST', body, keepalive: true })
  },
}
