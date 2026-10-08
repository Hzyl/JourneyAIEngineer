import { expect, test } from 'vitest'
import { appLocation, appPath } from '../app-location'

test.each(['/lesson/%E0%A4%A', '/lesson/%', '/lesson/a%2Fb', '/lesson/a%3Fb',
  '/lesson/', '/not-a-page', '/roadmap/extra', '/lesson/%00'])('invalid URL %s stays recoverable', (path) => {
  const location = appLocation(path, false)
  expect(location).toEqual({ view: 'missing', lesson: null })
  expect(appPath(location.view, location.lesson)).toBeNull()
})

test('valid lesson IDs retain their identity and hosted routes exclude local tools', () => {
  expect(appLocation('/lesson/phase-00-onboarding-environment-1', true))
    .toEqual({ view: 'lesson', lesson: 'phase-00-onboarding-environment-1' })
  expect(appLocation('/security', false)).toEqual({ view: 'security', lesson: null })
  expect(appLocation('/security', true)).toEqual({ view: 'missing', lesson: null })
  expect(appLocation('/roadmap/', false)).toEqual({ view: 'roadmap', lesson: null })
  expect(appLocation('/', true)).toEqual({ view: 'dashboard', lesson: null })
})
