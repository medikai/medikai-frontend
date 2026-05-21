import {
  DEMO_SESSION_COOKIE,
  DEMO_SESSION_MAX_AGE_SEC,
} from '@/lib/demo-session-constants'

describe('demo-session constants', () => {
  it('uses a stable cookie name', () => {
    expect(DEMO_SESSION_COOKIE).toBe('healthos_demo')
  })

  it('sets a positive max age', () => {
    expect(DEMO_SESSION_MAX_AGE_SEC).toBeGreaterThan(0)
  })
})
