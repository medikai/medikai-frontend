'use client'

import { motion } from 'motion/react'
import { ChevronRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const PATIENTS = [
  {
    name: 'Olivia Hart',
    initials: 'OH',
    reason: 'Cardiology consult',
    status: 'in-room',
    time: '09:30',
  },
  {
    name: 'Marcus Lin',
    initials: 'ML',
    reason: 'Lab follow‑up',
    status: 'waiting',
    time: '10:00',
  },
  {
    name: 'Sara Mensah',
    initials: 'SM',
    reason: 'New patient intake',
    status: 'scheduled',
    time: '10:30',
  },
  {
    name: 'Daniel Kim',
    initials: 'DK',
    reason: 'Post‑op review',
    status: 'scheduled',
    time: '11:00',
  },
  {
    name: 'Aisha Rahman',
    initials: 'AR',
    reason: 'Hypertension follow‑up',
    status: 'scheduled',
    time: '11:30',
  },
] as const

const statusStyles = {
  'in-room': 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
  waiting: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
  scheduled: 'bg-muted text-muted-foreground border-border',
} as const

export function PatientList() {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-base">Today&apos;s patients</CardTitle>
          <CardDescription>Live queue for your clinic</CardDescription>
        </div>
        <button className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
          View all <ChevronRight className="size-3.5" />
        </button>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border/60">
          {PATIENTS.map((p, i) => (
            <motion.li
              key={p.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              className="group flex cursor-pointer items-center gap-3 px-6 py-3.5 transition-colors hover:bg-accent/40"
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-sm font-semibold text-primary">
                {p.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                <p className="truncate text-xs text-muted-foreground">{p.reason}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-medium text-foreground">{p.time}</p>
                <Badge
                  variant="outline"
                  className={cn('mt-1 text-[10px] font-medium capitalize', statusStyles[p.status])}
                >
                  {p.status.replace('-', ' ')}
                </Badge>
              </div>
            </motion.li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
