'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'
import {
  Activity,
  ClipboardList,
  CreditCard,
  Phone,
  Stethoscope,
  Timer,
  ArrowRight,
} from 'lucide-react'
import type { Appointment, CompletionState } from '@/lib/data/appointments'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const statusBadge: Record<Appointment['status'], { label: string; cls: string }> = {
  scheduled: { label: 'Scheduled', cls: 'bg-muted text-muted-foreground border-border' },
  'checked-in': {
    label: 'Checked in',
    cls: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
  },
  'in-consult': {
    label: 'In consult',
    cls: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30',
  },
  completed: {
    label: 'Completed',
    cls: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  },
  cancelled: {
    label: 'Cancelled',
    cls: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
  },
}

const priorityRail: Record<Appointment['priority'], string> = {
  normal: 'bg-border',
  urgent: 'bg-rose-500',
  'follow-up': 'bg-sky-500',
}

const completionDot: Record<CompletionState, string> = {
  completed: 'bg-emerald-500',
  'in-progress': 'bg-amber-500',
  pending: 'bg-muted-foreground/30',
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function AppointmentCard({
  appointment: a,
  index = 0,
}: {
  appointment: Appointment
  index?: number
}) {
  const badge = statusBadge[a.status]

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: Math.min(index * 0.02, 0.2) }}
      whileHover={{ y: -2 }}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card transition-shadow hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Priority rail */}
      <span aria-hidden className={cn('absolute inset-y-0 left-0 w-1', priorityRail[a.priority])} />

      <div className="flex flex-col sm:flex-row sm:items-stretch">
        {/* Token */}
        <div className="flex shrink-0 items-center gap-4 border-b border-border/60 bg-gradient-to-br from-primary/5 to-transparent p-4 sm:w-[112px] sm:flex-col sm:items-center sm:justify-center sm:gap-1 sm:border-r sm:border-b-0 sm:px-5 sm:py-5">
          <div className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            Token
          </div>
          <div className="flex-1 text-3xl font-semibold tracking-tight text-foreground tabular-nums sm:flex-none sm:text-4xl">
            #{a.token}
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground sm:flex-col sm:gap-1">
            <Timer className="size-3.5" />
            {formatTime(a.scheduledAt)}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-3 p-4 sm:px-5 sm:py-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-sm font-semibold text-primary">
                {a.patient.initials}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate font-semibold text-foreground">{a.patient.name}</h3>
                  <span className="text-xs text-muted-foreground">
                    {a.patient.age}y · {a.patient.gender}
                  </span>
                  {a.priority === 'urgent' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-rose-600 uppercase dark:text-rose-400">
                      Urgent
                    </span>
                  )}
                  {a.priority === 'follow-up' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-sky-600 uppercase dark:text-sky-400">
                      Follow‑up
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">{a.reason}</p>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Stethoscope className="size-3" />
                    {a.doctor.name} · {a.doctor.specialty}
                  </span>
                </div>
              </div>
            </div>

            <span
              className={cn(
                'inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium',
                badge.cls,
              )}
            >
              {badge.label}
            </span>
          </div>

          {/* Status chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <StatusChip
              label="Vitals"
              state={a.vitalsStatus}
              icon={<Activity className="size-3" />}
            />
            <StatusChip
              label="SOAP"
              state={a.soapStatus}
              icon={<ClipboardList className="size-3" />}
            />
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-medium',
                a.paymentStatus === 'paid'
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                  : a.paymentStatus === 'waived'
                    ? 'border-border bg-muted text-muted-foreground'
                    : 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
              )}
            >
              <CreditCard className="size-3" />
              {a.paymentStatus === 'paid'
                ? 'Paid'
                : a.paymentStatus === 'waived'
                  ? 'Waived'
                  : 'Payment due'}
            </span>
            {a.waitMinutes > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2 py-0.5 font-medium text-muted-foreground">
                <Timer className="size-3" />
                Waiting {a.waitMinutes}m
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="mt-1 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs">
                <Phone className="size-3.5" />
                <span className="hidden sm:inline">Call</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs">
                <Activity className="size-3.5" />
                <span className="hidden sm:inline">Vitals</span>
              </Button>
            </div>
            <Button asChild size="sm" className="group/btn h-8 gap-1.5 text-xs">
              <Link href={`/dashboard/appointments/${a.id}`}>
                Open SOAP
                <ArrowRight className="size-3.5 transition-transform group-hover/btn:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function StatusChip({
  label,
  state,
  icon,
}: {
  label: string
  state: CompletionState
  icon: React.ReactNode
}) {
  const text =
    state === 'completed' ? 'Completed' : state === 'in-progress' ? 'In progress' : 'Pending'
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2 py-0.5 font-medium text-muted-foreground">
      <span className="text-foreground/60">{icon}</span>
      {label}
      <span className={cn('size-1.5 rounded-full', completionDot[state])} aria-hidden />
      <span className="text-foreground/70">{text}</span>
    </span>
  )
}

export { AppointmentCardSkeleton } from '@/components/mantine/appointment-card-skeleton'
