'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type StatCardProps = {
  label: string
  value: string | number
  delta?: { value: string; trend: 'up' | 'down' | 'neutral' }
  icon?: React.ReactNode
  hint?: string
  className?: string
  index?: number
}

export function StatCard({ label, value, delta, icon, hint, className, index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
          {hint ? <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p> : null}
        </div>
        {icon ? (
          <div className="inline-flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        ) : null}
      </div>
      {delta ? (
        <div className="relative mt-4 flex items-center gap-1.5 text-xs font-medium">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5',
              delta.trend === 'up' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
              delta.trend === 'down' && 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
              delta.trend === 'neutral' && 'bg-muted text-muted-foreground',
            )}
          >
            {delta.trend === 'up' ? (
              <ArrowUpRight className="size-3" />
            ) : delta.trend === 'down' ? (
              <ArrowDownRight className="size-3" />
            ) : null}
            {delta.value}
          </span>
          <span className="text-muted-foreground">vs last week</span>
        </div>
      ) : null}
    </motion.div>
  )
}
