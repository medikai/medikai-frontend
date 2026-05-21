'use client'

import * as React from 'react'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import { fadeInUp } from '@/lib/motion'

type RevealProps = React.ComponentProps<typeof motion.div> & {
  variants?: Variants
  delay?: number
  once?: boolean
  amount?: number
}

export function Reveal({
  variants = fadeInUp,
  delay = 0,
  once = true,
  amount = 0.25,
  children,
  ...props
}: RevealProps) {
  const reduce = useReducedMotion()
  if (reduce) {
    return (
      <div {...(props as React.HTMLAttributes<HTMLDivElement>)}>{children as React.ReactNode}</div>
    )
  }
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
