'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import {
  AppointmentCard,
  AppointmentCardSkeleton,
} from '@/components/dashboard/appointments/appointment-card'
import { DEMO_APPOINTMENTS, type Appointment } from '@/lib/data/appointments'

type StatusFilter = 'all' | 'scheduled' | 'checked-in' | 'in-consult' | 'completed'
const STATUS_TABS: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'checked-in', label: 'Checked in' },
  { id: 'in-consult', label: 'In consult' },
  { id: 'completed', label: 'Completed' },
]
const PRIORITY_OPTIONS = ['all', 'urgent', 'follow-up', 'normal'] as const
type PriorityFilter = (typeof PRIORITY_OPTIONS)[number]

const PAGE_SIZE = 12

export function AppointmentList() {
  const [query, setQuery] = React.useState('')
  const [status, setStatus] = React.useState<StatusFilter>('all')
  const [priority, setPriority] = React.useState<PriorityFilter>('all')
  const [visible, setVisible] = React.useState(PAGE_SIZE)
  const [loadingMore, setLoadingMore] = React.useState(false)
  const sentinelRef = React.useRef<HTMLDivElement>(null)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return DEMO_APPOINTMENTS.filter((a) => {
      if (status !== 'all' && a.status !== status) return false
      if (priority !== 'all' && a.priority !== priority) return false
      if (!q) return true
      return (
        a.patient.name.toLowerCase().includes(q) ||
        a.reason.toLowerCase().includes(q) ||
        a.doctor.name.toLowerCase().includes(q) ||
        String(a.token).includes(q)
      )
    })
  }, [query, status, priority])

  // Reset window when filters change
  React.useEffect(() => {
    setVisible(PAGE_SIZE)
  }, [query, status, priority])

  // Infinite scroll
  React.useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0]
        if (e.isIntersecting && visible < filtered.length && !loadingMore) {
          setLoadingMore(true)
          // simulate latency for smooth skeleton transition
          window.setTimeout(() => {
            setVisible((v) => Math.min(v + PAGE_SIZE, filtered.length))
            setLoadingMore(false)
          }, 350)
        }
      },
      { rootMargin: '600px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [filtered.length, visible, loadingMore])

  const items = filtered.slice(0, visible)
  const counts = React.useMemo(() => {
    const map: Record<StatusFilter, number> = {
      all: DEMO_APPOINTMENTS.length,
      scheduled: 0,
      'checked-in': 0,
      'in-consult': 0,
      completed: 0,
    }
    for (const a of DEMO_APPOINTMENTS) {
      if (a.status in map) map[a.status as StatusFilter]++
    }
    return map
  }, [])

  return (
    <div className="space-y-4">
      {/* Sticky filter bar */}
      <div className="sticky top-16 z-20 -mx-4 border-b border-border/60 bg-background/85 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Tabs value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
            <TabsList className="no-scrollbar h-9 overflow-x-auto">
              {STATUS_TABS.map((t) => (
                <TabsTrigger key={t.id} value={t.id} className="gap-1.5 px-3 text-xs">
                  {t.label}
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-px text-[10px] font-semibold',
                      status === t.id
                        ? 'bg-primary/15 text-primary'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {counts[t.id]}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 lg:w-72">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search patient, token, doctor…"
                className="h-9 pr-9 pl-9"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
            <PriorityMenu value={priority} onChange={setPriority} />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((a, i) => (
            <AppointmentCard key={a.id} appointment={a} index={i} />
          ))}
        </AnimatePresence>

        {loadingMore && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <AppointmentCardSkeleton />
              </div>
            ))}
          </div>
        )}

        {!filtered.length && (
          <EmptyState
            onReset={() => {
              setQuery('')
              setStatus('all')
              setPriority('all')
            }}
          />
        )}

        {visible >= filtered.length && filtered.length > 0 && (
          <p className="py-4 text-center text-xs text-muted-foreground">
            You&apos;re all caught up — {filtered.length} appointments shown
          </p>
        )}

        <div ref={sentinelRef} aria-hidden className="h-2" />
      </div>
    </div>
  )
}

function PriorityMenu({
  value,
  onChange,
}: {
  value: PriorityFilter
  onChange: (v: PriorityFilter) => void
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen((v) => !v)}
        className="h-9 gap-1.5 capitalize"
      >
        <SlidersHorizontal className="size-3.5" />
        <span className="hidden sm:inline">Priority:</span> {value === 'all' ? 'Any' : value}
      </Button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="absolute top-full right-0 z-20 mt-1 w-44 rounded-xl border border-border/60 bg-popover p-1 shadow-lg"
            >
              {PRIORITY_OPTIONS.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    onChange(p)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-sm capitalize hover:bg-accent',
                    value === p && 'bg-accent text-foreground',
                  )}
                >
                  {p === 'all' ? 'Any priority' : p}
                  {value === p && <span className="size-1.5 rounded-full bg-primary" aria-hidden />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
      <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Search className="size-5" />
      </div>
      <h3 className="mt-4 text-base font-semibold">No appointments match your filters</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Try clearing filters or searching by patient name, token, or doctor.
      </p>
      <Button variant="outline" size="sm" onClick={onReset} className="mt-4">
        Reset filters
      </Button>
    </div>
  )
}
