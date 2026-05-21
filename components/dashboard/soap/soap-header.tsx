'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Cloud,
  CloudOff,
  Loader2,
  Phone,
  Send,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useSoap } from '@/components/dashboard/soap/soap-context'
import { VitalsHeaderStrip } from '@/components/dashboard/soap/vitals-grid-editor'
import { ReportSenderDialog } from '@/components/dashboard/soap/report-sender-dialog'
import { cn } from '@/lib/utils'

export function SoapHeader() {
  const { appointment, completion, saveStatus, lastSavedAt } = useSoap()
  const [report, setReport] = React.useState(false)

  return (
    <>
      {/* Sticky header */}
      <header className="sticky top-16 z-20 -mx-4 border-b border-border/60 bg-background/85 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <Button asChild variant="ghost" size="icon" className="size-9 shrink-0">
              <Link href="/dashboard/appointments" aria-label="Back to appointments">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-sm font-semibold text-primary">
              {appointment.patient.initials}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-base font-semibold sm:text-lg">
                  {appointment.patient.name}
                </h1>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-primary uppercase">
                  Token #{appointment.token}
                </span>
                <span className="text-xs text-muted-foreground">
                  {appointment.patient.age}y · {appointment.patient.gender}
                </span>
              </div>
              <p className="truncate text-xs text-muted-foreground">
                {appointment.reason} · {appointment.doctor.name} ·{' '}
                {new Date(appointment.scheduledAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-auto">
            <SaveIndicator status={saveStatus} lastSavedAt={lastSavedAt} />
            <Button variant="outline" size="sm" className="hidden h-9 gap-1.5 sm:inline-flex">
              <Phone className="size-3.5" /> Call
            </Button>
            <Button size="sm" className="h-9 gap-1.5" onClick={() => setReport(true)}>
              <Send className="size-3.5" /> Send report
            </Button>
          </div>
        </div>

        {/* Progress strip */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex flex-wrap items-center gap-2">
              {completion.sections.map((s) => (
                <span
                  key={s.id}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium',
                    s.done
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {s.done ? (
                    <Check className="size-3" />
                  ) : (
                    <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                  )}
                  {s.label}
                </span>
              ))}
            </div>
            <span className="text-muted-foreground tabular-nums">{completion.value}% complete</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-[oklch(0.6_0.18_220)]"
              animate={{ width: `${completion.value}%` }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

        {/* Vitals strip */}
        <div className="mt-3">
          <VitalsHeaderStrip />
        </div>
      </header>

      <ReportSenderDialog open={report} onOpenChange={setReport} />
    </>
  )
}

function SaveIndicator({
  status,
  lastSavedAt,
}: {
  status: 'idle' | 'saving' | 'saved'
  lastSavedAt: Date | null
}) {
  return (
    <div className="hidden items-center gap-1.5 rounded-full border border-border/60 bg-card px-2.5 py-1 text-[11px] text-muted-foreground md:inline-flex">
      <AnimatePresence mode="wait" initial={false}>
        {status === 'saving' ? (
          <motion.span
            key="saving"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="inline-flex items-center gap-1.5"
          >
            <Loader2 className="size-3 animate-spin" /> Saving…
          </motion.span>
        ) : status === 'saved' ? (
          <motion.span
            key="saved"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400"
          >
            <Cloud className="size-3" /> Saved{' '}
            {lastSavedAt
              ? lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : ''}
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="inline-flex items-center gap-1.5"
          >
            <CloudOff className="size-3" /> Autosave on
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

export function StickyMobileSaveBar() {
  const { completion, saveStatus } = useSoap()
  const [report, setReport] = React.useState(false)
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-medium text-foreground">{completion.value}% complete</span>
              <span className="text-muted-foreground">
                {saveStatus === 'saving'
                  ? 'Saving…'
                  : saveStatus === 'saved'
                    ? 'Saved'
                    : 'Autosave'}
              </span>
            </div>
            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-[oklch(0.6_0.18_220)]"
                animate={{ width: `${completion.value}%` }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
          <Button size="sm" onClick={() => setReport(true)} className="gap-1.5">
            <Send className="size-3.5" /> Send
          </Button>
        </div>
      </div>
      <ReportSenderDialog open={report} onOpenChange={setReport} />
    </>
  )
}

export function AISuggestionPill({
  suggestion,
  onApply,
}: {
  suggestion: string
  onApply: () => void
}) {
  return (
    <button
      type="button"
      onClick={onApply}
      className="group inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-[11px] font-medium text-primary transition-colors hover:bg-primary/10"
    >
      <Sparkles className="size-3" />
      {suggestion}
      <span className="ml-1 rounded-full bg-primary/15 px-1.5 py-px text-[9px] font-semibold tracking-wider uppercase opacity-80 group-hover:opacity-100">
        Apply
      </span>
    </button>
  )
}
