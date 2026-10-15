import { describe, expect, test } from 'vitest'
import curriculum from '../../content/curriculum.json'
import routes from '../../content/learning_routes.json'
import overview from '../../content/roadmap_overview.json'

const phaseIds = new Set(curriculum.phases.map((phase) => phase.slug))
const routeIds = new Set(routes.routes.map((route) => route.id))
const projectSlugs = new Set(curriculum.program.portfolio_projects.map((project) => project.slug))

describe('roadmap metadata contracts', () => {
  test('routes declare core, optional and minimum portfolio metadata', () => {
    for (const route of routes.routes) {
      expect(route.core_phase_ids.length).toBeGreaterThan(0)
      expect(route.optional_phase_ids).toEqual(expect.any(Array))
      expect(route.minimum_project_slugs.length).toBeGreaterThan(0)
      expect(route.core_phase_ids.every((id) => route.phase_ids.includes(id))).toBe(true)
      expect(route.phase_ids.every((id) => phaseIds.has(id))).toBe(true)
    }
    const application = routes.routes.find((route) => route.id === 'application')!
    expect(application.core_phase_ids).toContain('phase-10-genai-transformers')
    expect(application.optional_phase_ids).not.toContain('phase-10-genai-transformers')
    expect(application.bridge_phase_ids).toEqual([
      'phase-08-genai-software',
      'phase-09-genai-ml-fundamentals',
      'phase-10-genai-transformers',
    ])
  })

  test('public stages expose planning metadata for every phase reference', () => {
    for (const stage of overview.stages) {
      expect(['core', 'specialization']).toContain(stage.track)
      expect(stage.required_for_routes).toEqual(expect.any(Array))
      expect(stage.difficulty).toBeTruthy()
      expect(stage.purpose.vi).toBeTruthy()
      expect(stage.prerequisites.vi).toBeTruthy()
      expect(stage.exit_criteria.vi).toBeTruthy()
      expect(stage.evidence_required.vi.length).toBeGreaterThan(0)
      expect(stage.estimated_weeks).toBeGreaterThan(0)
      expect(stage.project_slugs).toEqual(expect.any(Array))
      expect(stage.phase_ids.every((id) => phaseIds.has(id))).toBe(true)
      expect(stage.required_for_routes.every((id) => routeIds.has(id))).toBe(true)
      expect(stage.project_slugs.every((slug) => projectSlugs.has(slug))).toBe(true)
      expect((stage.bridge_phase_ids ?? []).every((id) => phaseIds.has(id))).toBe(true)
      expect((stage.optional_phase_ids ?? []).every((id) => phaseIds.has(id))).toBe(true)
    }
    expect(overview.sequence_note_vi).toContain('Python')
    expect(overview.sequence_note_vi).toContain('tool/agent')
    expect(overview.stages.find((stage) => stage.id === 'engineering')?.phase_ids).toEqual(['phase-05-mlops'])
    expect(overview.stages.find((stage) => stage.id === 'engineering')?.bridge_phase_ids).toEqual(['phase-08-genai-software'])
    expect(overview.stages.find((stage) => stage.id === 'specialization')?.phase_ids).toEqual([
      'phase-20-genai-finetuning',
      'phase-21-genai-local-llm',
      'phase-22-genai-system-design',
    ])
  })

  test('portfolio projects classify requirement and evidence for routes', () => {
    for (const project of curriculum.program.portfolio_projects) {
      expect(['required', 'recommended', 'optional']).toContain(project.requirement_level)
      expect(project.applicable_routes.length).toBeGreaterThan(0)
      expect(project.evidence_required.length).toBeGreaterThan(0)
      expect(phaseIds.has(project.phase_id)).toBe(true)
    }
  })
})
