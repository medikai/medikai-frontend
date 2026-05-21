'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import { Activity, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { VITAL_DEFS, vitalStatus, type Vitals } from '@/lib/data/vitals'
import { useSoap } from '@/components/dashboard/soap/soap-context'

const statusStyle = {
  normal: 'border-border bg-background focus-within:border-primary/50',
  low: 'border-sky-500/40 bg-sky-500/5 focus-within:border-sky-500',
  high: 'border-rose-500/40 bg-rose-500/5 focus-within:border-rose-500',
  empty: 'border-border bg-background focus-within:border-primary/50',
} as const

const statusText = {
  normal: 'text-emerald-600 dark:text-emerald-400',
  low: 'text-sky-600 dark:text-sky-400',
  high: 'text-rose-600 dark:text-rose-400',
  empty: 'text-muted-foreground',
} as const

export function VitalsGridEditor() {
  const { state, patch } = useSoap()
  const [vitals, setVitals] = React.useState<Vitals>(state.vitals)

  // sync local → context (debounced via context)
  React.useEffect(() => {
    patch({ vitals })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vitals])

  const abnormal = VITAL_DEFS.filter((d) => {
    const s = vitalStatus(d, vitals[d.key])
    return s === 'low' || s === 'high'
  })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
        {VITAL_DEFS.map((def) => {
          const value = vitals[def.key]
          const status = vitalStatus(def, value)
          return (
            <motion.div
              key={def.key}
              layout
              className={cn('rounded-xl border p-3 transition-colors', statusStyle[status])}
            >
              <div className="flex items-center justify-between">
                <Label
                  htmlFor={`v-${def.key}`}
                  className="text-[11px] font-medium text-muted-foreground"
                >
                  {def.label}
                </Label>
                {status !== 'empty' && status !== 'normal' && (
                  <span className={cn('text-[10px] font-semibold uppercase', statusText[status])}>
                    {status}
                  </span>
                )}
              </div>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <Input
                  id={`v-${def.key}`}
                  type="number"
                  inputMode="decimal"
                  step={def.step ?? 1}
                  value={value ?? ''}
                  onChange={(e) => {
                    const v = e.target.value === '' ? undefined : Number(e.target.value)
                    setVitals((s) => ({ ...s, [def.key]: v }))
                  }}
                  placeholder="—"
                  className="h-8 border-0 bg-transparent px-0 text-lg font-semibold tabular-nums shadow-none focus-visible:ring-0"
                />
                <span className="text-xs text-muted-foreground">{def.unit}</span>
              </div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">
                Normal {def.normal[0]}–{def.normal[1]} {def.unit}
              </div>
            </motion.div>
          )
        })}
      </div>

      {abnormal.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <div>
            <p className="font-semibold">
              {abnormal.length} abnormal vital{abnormal.length > 1 ? 's' : ''} detected
            </p>
            <p className="mt-0.5 opacity-90">
              {abnormal.map((d) => d.label).join(', ')}. Consider documenting in Assessment.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export function VitalsHeaderStrip() {
  const { state } = useSoap()
  const filled = VITAL_DEFS.filter((d) => state.vitals[d.key] !== undefined)
  if (filled.length === 0) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-dashed border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
        <Activity className="size-3.5" />
        No vitals captured
      </div>
    )
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {filled.map((d) => {
        const v = state.vitals[d.key]!
        const s = vitalStatus(d, v)
        return (
          <span
            key={d.key}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium',
              s === 'normal' &&
                'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
              s === 'high' && 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300',
              s === 'low' && 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300',
            )}
          >
            <CheckCircle2 className="size-3 opacity-60" />
            {d.label
              .replace('Heart rate', 'HR')
              .replace('Diastolic BP', 'DBP')
              .replace('Systolic BP', 'SBP')}{' '}
            {v}
            <span className="opacity-60">{d.unit}</span>
          </span>
        )
      })}
    </div>
  )
}
