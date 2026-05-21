'use client'

import * as React from 'react'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import { cn } from '@/lib/utils'
import { rhythmContainer, fadeInUp, barGrow, type RhythmPreset } from '@/lib/motion'

type Viewport = { once?: boolean; amount?: number }

type RevealStaggerProps = {
  children: React.ReactNode
  className?: string
  /** Preset stagger spacing; default matches marketing sections */
  preset?: RhythmPreset
  viewport?: Viewport
  variants?: Variants
}

/**
 * Staggers each direct child with a consistent “beat” (fade + rise).
 * Use for eyebrow → title → body → actions across marketing sections.
 */
export function RevealStagger({
  children,
  className,
  preset = 'section',
  viewport = { once: true, amount: 0.2 },
  variants = fadeInUp,
}: RevealStaggerProps) {
  const reduce = useReducedMotion()
  const items = React.Children.toArray(children).filter(Boolean)

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      variants={rhythmContainer(preset)}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {items.map((child, i) => (
        <motion.div key={i} variants={variants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

type SectionHeadingRhythmProps = {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  align?: 'left' | 'center'
  className?: string
  preset?: RhythmPreset
}

/** Same layout as SectionHeading, with viewport rhythm animation. */
export function SectionHeadingRhythm({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
  preset = 'section',
}: SectionHeadingRhythmProps) {
  const reduce = useReducedMotion()
  const base = cn(
    'flex flex-col gap-4 max-w-3xl',
    align === 'center' ? 'mx-auto items-center text-center' : 'items-start text-left',
    className,
  )

  const blocks: React.ReactNode[] = []
  if (eyebrow) blocks.push(eyebrow)
  blocks.push(
    <h2
      key="title"
      className="text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl md:text-5xl"
    >
      {title}
    </h2>,
  )
  if (description) {
    blocks.push(
      <p
        key="desc"
        className="text-base leading-relaxed text-pretty text-muted-foreground md:text-lg"
      >
        {description}
      </p>,
    )
  }

  if (reduce) {
    return <div className={base}>{blocks}</div>
  }

  return (
    <motion.div
      className={base}
      variants={rhythmContainer(preset)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {blocks.map((child, i) => (
        <motion.div key={i} variants={fadeInUp}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

export type { RhythmPreset } from '@/lib/motion'

/** Gradient accent bar — pairs with headline rhythm (scale-X reveal). */
export function RhythmGradientBar({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  if (reduce) {
    return (
      <span
        className={cn(
          'block h-1.5 rounded-full bg-gradient-to-r from-primary via-primary to-[oklch(0.55_0.18_270)]',
          className,
        )}
        aria-hidden
      />
    )
  }
  return (
    <motion.span
      variants={barGrow}
      className={cn(
        'block h-1.5 rounded-full bg-gradient-to-r from-primary via-primary to-[oklch(0.55_0.18_270)]',
        className,
      )}
      style={{ transformOrigin: 'left center' }}
      aria-hidden
    />
  )
}
