'use client'

import { motion } from 'motion/react'
import { Activity, Droplets, HeartPulse, Thermometer, TrendingUp } from 'lucide-react'
import { Container } from '@/components/shared/container'
import { Section, Eyebrow } from '@/components/shared/section'
import { Reveal } from '@/components/shared/reveal'
import { rhythmContainer, fadeInUp, easeOutExpo } from '@/lib/motion'
import { cn } from '@/lib/utils'

const METRICS = [
  { Icon: HeartPulse, label: 'Heart rate', value: '72', unit: 'bpm', trend: '+2', tone: 'rose' },
  { Icon: Droplets, label: 'Blood oxygen', value: '98', unit: '%', trend: 'stable', tone: 'sky' },
  {
    Icon: Thermometer,
    label: 'Temperature',
    value: '36.7',
    unit: '°C',
    trend: 'normal',
    tone: 'amber',
  },
  { Icon: Activity, label: 'Glucose', value: '92', unit: 'mg/dL', trend: '−4', tone: 'emerald' },
] as const

const toneMap = {
  rose: 'text-rose-500 bg-rose-500/10',
  sky: 'text-sky-500 bg-sky-500/10',
  amber: 'text-amber-500 bg-amber-500/10',
  emerald: 'text-emerald-500 bg-emerald-500/10',
} as const

export function MetricsSection() {
  return (
    <Section id="metrics" spacing="lg">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            variants={rhythmContainer('section')}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex max-w-xl flex-col gap-4"
          >
            <motion.div variants={fadeInUp}>
              <Eyebrow icon={<TrendingUp className="size-3" />}>Health metrics</Eyebrow>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl"
            >
              Real‑time vitals, <span className="text-primary">beautifully visualized</span>.
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-base leading-relaxed text-pretty text-muted-foreground md:text-lg"
            >
              Every reading from every device, in one timeline. Set thresholds, receive alerts, and
              spot trends weeks before they become incidents.
            </motion.p>

            <motion.ul variants={rhythmContainer('tight')} className="mt-4 space-y-3">
              {[
                'Native integrations with Apple Health, Fitbit, Oura and 30+ medical devices',
                'Configurable alert thresholds with on‑call routing',
                'Patient‑facing trends and personalized goals',
              ].map((item) => (
                <motion.li
                  key={item}
                  variants={fadeInUp}
                  className="flex items-start gap-3 text-sm text-foreground/85"
                >
                  <span className="mt-1 inline-flex size-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <svg viewBox="0 0 16 16" className="size-3" fill="none">
                      <path
                        d="M3 8.5l3 3 7-7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          <Reveal delay={0.1}>
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-primary/15 via-transparent to-primary/10 blur-2xl"
              />
              <div className="relative rounded-2xl border border-border/60 bg-card p-5 shadow-xl shadow-primary/5 sm:p-6">
                <div className="grid grid-cols-2 gap-3">
                  {METRICS.map((m, i) => (
                    <motion.div
                      key={m.label}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ delay: i * 0.1, duration: 0.55, ease: easeOutExpo }}
                      className="rounded-xl border border-border/60 bg-background/60 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className={cn(
                            'inline-flex size-8 items-center justify-center rounded-lg',
                            toneMap[m.tone],
                          )}
                        >
                          <m.Icon className="size-4" />
                        </div>
                        <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                          {m.trend}
                        </span>
                      </div>
                      <div className="mt-3 text-2xl font-semibold tracking-tight">
                        {m.value}
                        <span className="ml-1 text-sm font-normal text-muted-foreground">
                          {m.unit}
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">{m.label}</div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-5 rounded-xl border border-border/60 bg-background/60 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Heart rate · 24h</div>
                    <div className="text-xs text-muted-foreground">avg 71 bpm</div>
                  </div>
                  <svg
                    viewBox="0 0 600 120"
                    className="mt-3 h-24 w-full"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="m-grad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.6 0.118 184.704)" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="oklch(0.6 0.118 184.704)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d="M0,80 L40,82 L60,40 L70,90 L90,80 L160,75 L200,30 L210,95 L230,80 L320,70 L360,28 L370,98 L390,80 L500,75 L540,40 L555,92 L575,80 L600,80 L600,120 L0,120 Z"
                      fill="url(#m-grad)"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.4 }}
                    />
                    <motion.path
                      d="M0,80 L40,82 L60,40 L70,90 L90,80 L160,75 L200,30 L210,95 L230,80 L320,70 L360,28 L370,98 L390,80 L500,75 L540,40 L555,92 L575,80 L600,80"
                      stroke="oklch(0.6 0.118 184.704)"
                      strokeWidth="2"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
