'use client'

import { motion } from 'motion/react'
import { CalendarCheck, FlaskConical, Stethoscope, HeartPulse, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const EVENTS = [
  {
    Icon: CalendarCheck,
    tone: 'primary',
    title: 'Appointment confirmed',
    desc: 'Olivia Hart with Dr. Patel — Cardiology',
    time: '2m ago',
  },
  {
    Icon: AlertTriangle,
    tone: 'warning',
    title: 'Vital threshold exceeded',
    desc: 'Patient #4382: SpO₂ dropped to 92%',
    time: '14m ago',
  },
  {
    Icon: FlaskConical,
    tone: 'info',
    title: 'Lab results ready',
    desc: 'CBC for Marcus Lin — reviewed by AI',
    time: '38m ago',
  },
  {
    Icon: Stethoscope,
    tone: 'success',
    title: 'Consultation completed',
    desc: 'Dr. Rao concluded 11 visits today',
    time: '1h ago',
  },
  {
    Icon: HeartPulse,
    tone: 'rose',
    title: 'New patient onboarded',
    desc: 'Sara Mensah completed registration',
    time: '2h ago',
  },
] as const

const toneMap = {
  primary: 'bg-primary/10 text-primary ring-primary/20',
  warning: 'bg-amber-500/10 text-amber-500 ring-amber-500/20',
  info: 'bg-sky-500/10 text-sky-500 ring-sky-500/20',
  success: 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20',
  rose: 'bg-rose-500/10 text-rose-500 ring-rose-500/20',
} as const

export function ActivityTimeline() {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-base">Recent activity</CardTitle>
        <CardDescription>Latest events across your workspace</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="relative space-y-5 before:absolute before:top-2 before:bottom-2 before:left-[19px] before:w-px before:bg-border">
          {EVENTS.map((e, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="relative flex gap-3"
            >
              <span
                className={cn(
                  'relative z-10 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-card ring-1',
                  toneMap[e.tone],
                )}
              >
                <e.Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1 pt-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-sm font-medium text-foreground">{e.title}</p>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{e.time}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{e.desc}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}
