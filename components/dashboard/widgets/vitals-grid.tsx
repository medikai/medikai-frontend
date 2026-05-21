'use client'

import { motion } from 'motion/react'
import { HeartPulse, Droplets, Thermometer, Activity } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const VITALS = [
  { Icon: HeartPulse, label: 'Heart rate', value: 72, unit: 'bpm', tone: 'rose', percent: 60 },
  { Icon: Droplets, label: 'Blood oxygen', value: 98, unit: '%', tone: 'sky', percent: 98 },
  { Icon: Thermometer, label: 'Temperature', value: 36.7, unit: '°C', tone: 'amber', percent: 55 },
  { Icon: Activity, label: 'Glucose', value: 92, unit: 'mg/dL', tone: 'emerald', percent: 70 },
] as const

const toneMap = {
  rose: 'text-rose-500 bg-rose-500/10',
  sky: 'text-sky-500 bg-sky-500/10',
  amber: 'text-amber-500 bg-amber-500/10',
  emerald: 'text-emerald-500 bg-emerald-500/10',
} as const

const barTone = {
  rose: 'bg-rose-500',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
  emerald: 'bg-emerald-500',
} as const

export function VitalsGrid() {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-base">Live vitals — Olivia Hart</CardTitle>
        <CardDescription>Streaming from connected device · 2s ago</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {VITALS.map((v, i) => (
            <motion.div
              key={v.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="rounded-xl border border-border/60 bg-background/40 p-4"
            >
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    'inline-flex size-8 items-center justify-center rounded-lg',
                    toneMap[v.tone],
                  )}
                >
                  <v.Icon className="size-4" />
                </div>
                <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                  Live
                </span>
              </div>
              <div className="mt-3 text-2xl font-semibold tracking-tight">
                {v.value}
                <span className="ml-1 text-sm font-normal text-muted-foreground">{v.unit}</span>
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">{v.label}</div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${v.percent}%` }}
                  transition={{ duration: 1, delay: 0.2 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className={cn('h-full rounded-full', barTone[v.tone])}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
