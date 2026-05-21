import { MVP_SIGNIN_VISIBLE_ROLES, planIncludesDoctorAdmin, planIncludesPlatformAdmin } from './mvp'

describe('MVP_SIGNIN_VISIBLE_ROLES', () => {
  it('exposes patient and doctor for public sign-in', () => {
    expect(MVP_SIGNIN_VISIBLE_ROLES).toEqual(['patient', 'doctor'])
  })
})

describe('planIncludesDoctorAdmin', () => {
  it('returns true for growth and enterprise', () => {
    expect(planIncludesDoctorAdmin('growth')).toBe(true)
    expect(planIncludesDoctorAdmin('enterprise')).toBe(true)
  })

  it('returns false for starter', () => {
    expect(planIncludesDoctorAdmin('starter')).toBe(false)
  })
})

describe('planIncludesPlatformAdmin', () => {
  it('returns true only for enterprise', () => {
    expect(planIncludesPlatformAdmin('enterprise')).toBe(true)
    expect(planIncludesPlatformAdmin('growth')).toBe(false)
    expect(planIncludesPlatformAdmin('starter')).toBe(false)
  })
})
