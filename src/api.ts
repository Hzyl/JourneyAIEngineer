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
  code_examples: Array<{ language: string; title: string; code: string; explanation_vi: string; explanation_en: string }>
  resources: Array<{ title: string; url: string; language: string }>
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

export type AppSettings = {
  language: 'vi' | 'en'
  track: 'standard' | 'accelerated'
  weekly_goal_minutes: number
  show_completed_lessons: boolean
  target_role: 'internship' | 'junior' | 'career_switch'
  experience_level: 'beginner' | 'intermediate' | 'advanced'
  onboarding_complete: boolean
}

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
  dashboard: () => request<Dashboard>('/dashboard'),
  roadmap: () => request<{ program: { title_vi: string; title_en: string; description_vi: string; description_en: string; standard_weeks: number; accelerated_weeks: number; portfolio_projects: PortfolioProject[]; career_checklist: string[] }; phases: any[] }>('/roadmap'),
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
  exportJournal: () => request<{ path: string; week: string }>('/journal/export', { method: 'POST' }),
  exportContext: (payload: { lesson_slug?: string; exercise_slug?: string; question: string }) => request<{ path: string; content: string }>('/context/export', { method: 'POST', body: JSON.stringify(payload) }),
}
