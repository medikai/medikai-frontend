import { healthOsTheme } from './mantine-theme'

describe('healthOsTheme', () => {
  it('uses teal as primary color', () => {
    expect(healthOsTheme.primaryColor).toBe('teal')
  })

  it('defines brand palette', () => {
    expect(healthOsTheme.colors?.brand).toHaveLength(10)
  })

  it('binds fonts to CSS variables', () => {
    expect(healthOsTheme.fontFamily).toContain('--font-sans')
  })
})
