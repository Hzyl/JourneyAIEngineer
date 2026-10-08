import { beforeEach, expect, test, vi } from 'vitest'
import { hostedApi } from '../platform/hosted/hosted-client'

const services = vi.hoisted(() => ({ requireHostedUser: vi.fn(), requireSupabase: vi.fn() }))
vi.mock('../platform/hosted/supabase-client', () => services)

beforeEach(() => { vi.resetAllMocks() })

test('normal hosted search reads the bundled catalogue without authentication or progress requests', async () => {
  const result = await hostedApi.search('summarize_scores', { type: 'exercises' })
  expect(result.results.some((item) => item.slug === 'exercise-0-baseline' && item.title_en)).toBe(true)
  expect(services.requireHostedUser).not.toHaveBeenCalled()
  expect(services.requireSupabase).not.toHaveBeenCalled()
  const available = await hostedApi.search('', { type: 'exercises', status: 'available', limit: 3 })
  expect(available.results).toHaveLength(3)
  expect(services.requireSupabase).not.toHaveBeenCalled()
})

test('status-filtered search retrieves only the signed-in user progress and respects it', async () => {
  services.requireHostedUser.mockResolvedValue({ id: 'user-one' })
  const query = {
    select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(), gt: vi.fn().mockReturnThis(),
    then: vi.fn().mockImplementationOnce((resolve) => resolve({
      data: [{ lesson_slug: 'phase-00-onboarding-environment-1', status: 'completed' }], error: null,
    })).mockImplementation((resolve) => resolve({ data: [], error: null })),
  }
  const from = vi.fn().mockReturnValue(query)
  services.requireSupabase.mockReturnValue({ from })
  const result = await hostedApi.search('', { type: 'lessons', status: 'completed' })
  expect(from).toHaveBeenCalledWith('lesson_progress')
  expect(query.eq).toHaveBeenCalledWith('user_id', 'user-one')
  expect(query.gt).toHaveBeenCalledWith('lesson_slug', 'phase-00-onboarding-environment-1')
  expect(result.results.map((item) => item.slug)).toEqual(['phase-00-onboarding-environment-1'])
})
