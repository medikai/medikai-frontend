'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Pill, Plus, Search, Sparkles, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  COMMON_MEDS,
  FREQUENCIES,
  TIMINGS,
  DURATIONS,
  PRESCRIPTION_TEMPLATES,
  type Medication,
  type Prescription,
} from '@/lib/data/medications'
import { useSoap } from '@/components/dashboard/soap/soap-context'

export function MedicationManager() {
  const { state, patch } = useSoap()
  const [open, setOpen] = React.useState(false)
  const items = state.prescriptions

  const remove = (id: string) => patch({ prescriptions: items.filter((p) => p.id !== id) })

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold">
            <Pill className="size-4 text-primary" />
            Medications
            <span className="text-xs text-muted-foreground">({items.length})</span>
          </h4>
          <p className="text-xs text-muted-foreground">
            Search a medication or use a template to prescribe in one click.
          </p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          Add medication
        </Button>
      </div>

      {items.length === 0 ? (
        <button
          onClick={() => setOpen(true)}
          className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 px-4 py-8 text-center transition-colors hover:border-primary/40 hover:bg-card"
        >
          <Pill className="size-5 text-muted-foreground" />
          <p className="mt-2 text-sm font-medium text-foreground">No medications added</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Click to search a drug or apply a quick template
          </p>
        </button>
      ) : (
        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {items.map((p) => {
              const freq = FREQUENCIES.find((f) => f.id === p.frequency)
              const tim = TIMINGS.find((t) => t.id === p.timing)
              return (
                <motion.li
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 px-3 py-2.5"
                >
                  <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                    Rx
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold">{p.med.name}</p>
                      <span className="text-xs text-muted-foreground">{p.med.strength}</span>
                      <span className="text-[10px] tracking-wider text-muted-foreground/70 uppercase">
                        {p.med.form}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {freq?.short} · {tim?.label} · {p.duration}
                      {p.notes ? ` · ${p.notes}` : ''}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-rose-500"
                    aria-label="Remove medication"
                    onClick={() => remove(p.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </ul>
      )}

      <MedicationDrawer open={open} onOpenChange={setOpen} />
    </div>
  )
}

function MedicationDrawer({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const { state, patch } = useSoap()
  const [view, setView] = React.useState<'search' | 'configure'>('search')
  const [query, setQuery] = React.useState('')
  const [selected, setSelected] = React.useState<Medication | null>(null)
  const [frequency, setFrequency] = React.useState<Prescription['frequency']>('bd')
  const [timing, setTiming] = React.useState<Prescription['timing']>('after')
  const [duration, setDuration] = React.useState<string>('5 days')
  const [notes, setNotes] = React.useState('')

  React.useEffect(() => {
    if (!open) {
      setView('search')
      setQuery('')
      setSelected(null)
      setNotes('')
    }
  }, [open])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return COMMON_MEDS.slice(0, 8)
    return COMMON_MEDS.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.strength.toLowerCase().includes(q) ||
        m.form.toLowerCase().includes(q),
    ).slice(0, 12)
  }, [query])

  const choose = (m: Medication) => {
    setSelected(m)
    setView('configure')
  }

  const add = () => {
    if (!selected) return
    const p: Prescription = {
      id: `rx_${Date.now()}`,
      med: selected,
      frequency,
      timing,
      duration,
      notes: notes.trim() || undefined,
    }
    patch({ prescriptions: [...state.prescriptions, p] })
    onOpenChange(false)
  }

  const applyTemplate = (id: string) => {
    const t = PRESCRIPTION_TEMPLATES.find((x) => x.id === id)
    if (!t) return
    const newRx: Prescription[] = t.items.map((i, idx) => ({
      id: `rx_${Date.now()}_${idx}`,
      ...i,
    }))
    patch({ prescriptions: [...state.prescriptions, ...newRx] })
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="space-y-1 border-b border-border/60 px-5 py-4">
          <SheetTitle className="flex items-center gap-2">
            <Pill className="size-4 text-primary" />
            {view === 'search' ? 'Add medication' : 'Configure prescription'}
          </SheetTitle>
          <SheetDescription className="text-xs">
            {view === 'search'
              ? 'Search a drug or apply a smart template'
              : `${selected?.name} · ${selected?.strength}`}
          </SheetDescription>
        </SheetHeader>

        <AnimatePresence mode="wait">
          {view === 'search' ? (
            <motion.div
              key="search"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="flex-1 space-y-5 overflow-y-auto p-5"
            >
              <div className="relative">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, strength or form…"
                  className="h-10 pl-9"
                />
              </div>

              <div>
                <p className="px-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  {query ? 'Results' : 'Common medications'}
                </p>
                <ul className="mt-2 space-y-1">
                  {filtered.map((m) => (
                    <li key={m.id}>
                      <button
                        onClick={() => choose(m)}
                        className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-card px-3 py-2.5 text-left transition-colors hover:border-primary/40 hover:bg-accent/40"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{m.name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {m.strength} · {m.form}
                          </p>
                        </div>
                        <Plus className="size-4 text-muted-foreground" />
                      </button>
                    </li>
                  ))}
                  {filtered.length === 0 && (
                    <li className="rounded-lg border border-dashed border-border bg-card/40 px-3 py-6 text-center text-xs text-muted-foreground">
                      No medications found for &ldquo;{query}&rdquo;
                    </li>
                  )}
                </ul>
              </div>

              <div>
                <p className="flex items-center gap-1 px-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  <Sparkles className="size-3 text-primary" />
                  Smart templates
                </p>
                <ul className="mt-2 grid grid-cols-1 gap-2">
                  {PRESCRIPTION_TEMPLATES.map((t) => (
                    <li key={t.id}>
                      <button
                        onClick={() => applyTemplate(t.id)}
                        className="w-full rounded-xl border border-border/60 bg-gradient-to-br from-primary/[0.05] to-transparent px-3 py-3 text-left transition-colors hover:border-primary/40"
                      >
                        <p className="text-sm font-semibold">{t.name}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {t.description} · {t.items.length} item{t.items.length > 1 ? 's' : ''}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="configure"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.18 }}
              className="flex-1 space-y-5 overflow-y-auto p-5"
            >
              <Group label="Frequency">
                <Chips
                  options={FREQUENCIES.map((f) => ({ id: f.id, label: f.label, hint: f.short }))}
                  value={frequency}
                  onChange={(v) => setFrequency(v as Prescription['frequency'])}
                />
              </Group>
              <Group label="Timing">
                <Chips
                  options={TIMINGS.map((t) => ({ id: t.id, label: t.label }))}
                  value={timing}
                  onChange={(v) => setTiming(v as Prescription['timing'])}
                />
              </Group>
              <Group label="Duration">
                <Chips
                  options={DURATIONS.map((d) => ({ id: d, label: d }))}
                  value={duration}
                  onChange={setDuration}
                />
              </Group>
              <Group label="Notes (optional)">
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. avoid alcohol, drowsiness possible"
                  className="h-10"
                />
              </Group>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between gap-2 border-t border-border/60 p-4">
          {view === 'configure' ? (
            <Button variant="ghost" size="sm" onClick={() => setView('search')}>
              ← Change drug
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="size-4" /> Close
            </Button>
          )}
          {view === 'configure' && (
            <Button size="sm" onClick={add} className="gap-1.5">
              <Plus className="size-4" /> Add to prescription
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
        {label}
      </p>
      {children}
    </div>
  )
}

function Chips<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string; hint?: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
            value === o.id
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-card text-foreground/80 hover:border-primary/40',
          )}
        >
          {o.label}
          {o.hint && (
            <span
              className={cn(
                'font-mono text-[10px]',
                value === o.id ? 'opacity-80' : 'text-muted-foreground',
              )}
            >
              {o.hint}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
