import { fadeIn, fadeInUp, rhythmContainer, staggerContainer, type RhythmPreset } from './motion'

describe('staggerContainer', () => {
  it('applies custom stagger and delay', () => {
    const variants = staggerContainer(0.2, 0.1)
    const visible = variants.visible as Record<string, unknown>
    const transition = visible?.transition as Record<string, number>
    expect(transition).toMatchObject({
      staggerChildren: 0.2,
      delayChildren: 0.1,
    })
  })
})

describe('rhythmContainer', () => {
  it.each<RhythmPreset>(['section', 'tight', 'cards'])(
    'returns stagger config for preset %s',
    (preset) => {
      const variants = rhythmContainer(preset)
      const visible = variants.visible as Record<string, unknown>
      const transition = visible?.transition as Record<string, number>
      expect(transition?.staggerChildren).toBeGreaterThan(0)
    },
  )
})

describe('motion presets', () => {
  it('defines hidden and visible states for fadeInUp', () => {
    expect(fadeInUp.hidden).toMatchObject({ opacity: 0, y: 24 })
    expect(fadeInUp.visible).toMatchObject({ opacity: 1, y: 0 })
  })

  it('defines fadeIn visibility transition', () => {
    expect(fadeIn.hidden).toEqual({ opacity: 0 })
    expect(fadeIn.visible).toMatchObject({ opacity: 1 })
  })
})
