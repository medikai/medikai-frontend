'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight, Sparkles, ShieldCheck, Activity, HeartPulse, Stethoscope } from 'lucide-react'
import { Container } from '@/components/shared/container'
import { Button } from '@/components/ui/button'
import { staggerContainer, fadeInUp, easeOutExpo, rhythmContainer } from '@/lib/motion'
import { cn } from '@/lib/utils'

export function HeroSection() {
  const reduce = useReducedMotion()

  return (
    <section className="bg-mesh bg-noise relative overflow-hidden pt-28 pb-20 sm:pt-32 md:pt-40 md:pb-28">
      <div aria-hidden className="bg-grid absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 size-[720px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]"
      />

      <Container className="relative">
        <motion.div
          variants={rhythmContainer('section')}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-3xl text-center"
        >
          <motion.p variants={fadeInUp} className="text-center text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Now with AI co‑pilot for clinicians</span>{' '}
            <span className="text-primary">New</span>
          </motion.p>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            <motion.span variants={fadeInUp} className="block">
              The operating system
            </motion.span>
            <motion.span variants={fadeInUp} className="mt-2 block">
              <span className="sm:whitespace-nowrap">
                for <span className="text-primary">modern healthcare</span>
              </span>
            </motion.span>
          </h1>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg md:text-xl"
          >
            HealthOS unifies patients, doctors, labs and staff into one secure, AI‑native platform —
            so your team can focus on care, not paperwork.
          </motion.p>

          <motion.div
            variants={staggerContainer(0.1, 0)}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <motion.div variants={fadeInUp}>
              <Button
                asChild
                size="lg"
                className="group h-12 px-6 text-base shadow-lg shadow-primary/20"
              >
                <Link href="/register/patient">
                  Start free
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base">
                <Link href="/login">Book a demo</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="mt-5 inline-flex items-center justify-center gap-2 text-xs text-muted-foreground"
          >
            <ShieldCheck className="size-3.5 text-emerald-500" />
            ABHA-ready · Encrypted at rest & in transit
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.5 }}
          className="relative mx-auto mt-16 max-w-6xl"
        >
          <DashboardPreview reduce={!!reduce} />
        </motion.div>
      </Container>
    </section>
  )
}

function DashboardPreview({ reduce }: { reduce: boolean }) {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-x-12 -top-10 h-40 bg-gradient-to-b from-primary/20 to-transparent blur-3xl"
      />
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-2xl shadow-primary/10 backdrop-blur-xl">
        <div className="flex items-center gap-1.5 border-b border-border/60 bg-muted/40 px-4 py-3">
          <div className="size-2.5 rounded-full bg-red-400/80" />
          <div className="size-2.5 rounded-full bg-amber-400/80" />
          <div className="size-2.5 rounded-full bg-emerald-400/80" />
          <div className="ml-4 hidden h-6 flex-1 items-center rounded-md bg-background/60 px-3 font-mono text-[11px] text-muted-foreground sm:flex">
            healthos.app/dashboard
          </div>
        </div>

        <div className="grid grid-cols-12 gap-3 p-3 sm:gap-4 sm:p-5">
          <div className="col-span-12 space-y-3 sm:col-span-3">
            {[
              { Icon: Activity, label: 'Overview', active: true },
              { Icon: HeartPulse, label: 'Vitals' },
              { Icon: Stethoscope, label: 'Patients' },
            ].map(({ Icon, label, active }) => (
              <div
                key={label}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm',
                  active ? 'bg-primary/10 font-medium text-primary' : 'text-muted-foreground',
                )}
              >
                <Icon className="size-4" />
                {label}
              </div>
            ))}
          </div>

          <div className="col-span-12 space-y-4 sm:col-span-9">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Active patients', value: '12,408', delta: '+8.2%' },
                { label: 'Appointments today', value: '342', delta: '+12' },
                { label: 'Avg. response', value: '2m 14s', delta: '−18%' },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl border border-border/60 bg-background/60 p-3.5"
                >
                  <div className="text-[11px] text-muted-foreground">{m.label}</div>
                  <div className="mt-1 text-lg font-semibold tracking-tight">{m.value}</div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
                    {m.delta}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-border/60 bg-background/60 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Patient vitals · last 24h</div>
                <div className="text-xs text-muted-foreground">BPM</div>
              </div>
              <svg viewBox="0 0 600 140" className="mt-3 h-28 w-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="hero-grad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.6 0.118 184.704)" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="oklch(0.6 0.118 184.704)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M0,90 C60,60 100,110 160,80 C220,55 260,100 320,70 C380,40 420,95 480,60 C540,30 580,80 600,55 L600,140 L0,140 Z"
                  fill="url(#hero-grad)"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.8 }}
                />
                <motion.path
                  d="M0,90 C60,60 100,110 160,80 C220,55 260,100 320,70 C380,40 420,95 480,60 C540,30 580,80 600,55"
                  fill="none"
                  stroke="oklch(0.6 0.118 184.704)"
                  strokeWidth="2"
                  initial={reduce ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.6, delay: 0.6, ease: easeOutExpo }}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Floating badges */}
      <motion.div
        initial={{ opacity: 0, y: 20, x: -20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.7, delay: 1.2 }}
        className="absolute top-1/3 -left-3 hidden items-center gap-2 rounded-xl border border-border/60 bg-card/90 px-3 py-2 shadow-lg backdrop-blur sm:-left-10 md:flex"
      >
        <span className="relative flex size-2.5">
          <span
            className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/60"
            style={{ animation: 'hos-pulse 2s ease-in-out infinite' }}
          />
          <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
        </span>
        <span className="text-xs font-medium">All systems healthy</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20, x: 20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.7, delay: 1.4 }}
        className="absolute -right-3 bottom-10 hidden items-center gap-2 rounded-xl border border-border/60 bg-card/90 px-3 py-2 shadow-lg backdrop-blur sm:-right-10 md:flex"
      >
        <Sparkles className="size-4 text-primary" />
        <span className="text-xs font-medium">AI summary ready</span>
      </motion.div>
    </div>
  )
}
