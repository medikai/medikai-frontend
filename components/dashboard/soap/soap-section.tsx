'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import { ChevronDown, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type SoapSectionProps = {
  id: string
  title: string
  description?: string
  Icon: LucideIcon
  defaultOpen?: boolean
  done?: boolean
  badge?: React.ReactNode
  actions?: React.ReactNode
  children: React.ReactNode
}

export function SoapSection({
  id,
  title,
  description,
  Icon,
  defaultOpen = true,
  done,
  badge,
  actions,
  children,
}: SoapSectionProps) {
  const [open, setOpen] = React.useState(defaultOpen)

  return (
    <section
      id={id}
      className={cn(
        'overflow-hidden rounded-2xl border bg-card transition-colors',
        done ? 'border-emerald-500/30' : 'border-border/60',
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/40 sm:px-5 sm:py-4"
      >
        <span
          className={cn(
            'inline-flex size-9 shrink-0 items-center justify-center rounded-xl',
            done
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
              : 'bg-primary/10 text-primary',
          )}
        >
          <Icon className="size-4.5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{title}</h3>
            {badge}
          </div>
          {description && <p className="truncate text-xs text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="hidden items-center gap-1 sm:flex">{actions}</div>}
        <ChevronDown
          className={cn(
            'size-4 shrink-0 text-muted-foreground transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>

      <motion.div
        initial={false}
        animate={open ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <div className="space-y-4 border-t border-border/60 px-4 py-4 sm:px-5 sm:py-5">
          {actions && <div className="-mt-2 flex items-center gap-1 sm:hidden">{actions}</div>}
          {children}
        </div>
      </motion.div>
    </section>
  )
}
