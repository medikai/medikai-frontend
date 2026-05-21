import type { Variants, Transition } from 'motion/react'

export const easeOutExpo: Transition['ease'] = [0.16, 1, 0.3, 1]
export const easeInOutSoft: Transition['ease'] = [0.65, 0, 0.35, 1]

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOutExpo },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: easeOutExpo } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: easeOutExpo },
  },
}

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: easeOutExpo } },
}

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: easeOutExpo } },
}

export const staggerContainer = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
})

/** Named presets so marketing sections share one “beat”. */
export type RhythmPreset = 'section' | 'tight' | 'cards'

const RHYTHM_PRESETS: Record<RhythmPreset, { stagger: number; delay: number }> = {
  section: { stagger: 0.11, delay: 0.06 },
  tight: { stagger: 0.08, delay: 0.04 },
  cards: { stagger: 0.1, delay: 0.08 },
}

export function rhythmContainer(preset: RhythmPreset = 'section'): Variants {
  const { stagger, delay } = RHYTHM_PRESETS[preset]
  return staggerContainer(stagger, delay)
}

/** Horizontal accent (headline underline) — use inside a stagger parent. */
export const barGrow: Variants = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.82, ease: easeOutExpo },
  },
}

export const cardHover = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -4,
    scale: 1.01,
    transition: { type: 'spring', stiffness: 300, damping: 22 },
  },
} as const

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOutExpo } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease: easeInOutSoft } },
}
