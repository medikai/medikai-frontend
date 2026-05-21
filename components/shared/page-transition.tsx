'use client'

import { motion, useReducedMotion } from 'motion/react'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import { pageTransition } from '@/lib/motion'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const reduce = useReducedMotion()
  if (reduce) return <>{children}</>
  return (
    <motion.div key={pathname} initial="hidden" animate="visible" variants={pageTransition}>
      {children}
    </motion.div>
  )
}
