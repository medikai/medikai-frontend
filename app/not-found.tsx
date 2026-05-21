'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import {
  ArrowLeft,
  CalendarDays,
  Home,
  LayoutDashboard,
  LifeBuoy,
  Search,
  Stethoscope,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const QUICK_LINKS = [
  { href: '/', label: 'Home', Icon: Home },
  { href: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/dashboard/appointments', label: 'Appointments', Icon: CalendarDays },
  { href: '/login', label: 'Sign in', Icon: Stethoscope },
]

export default function NotFound() {
  const reduce = useReducedMotion()

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16">
      {/* Decorative background */}
      <div aria-hidden className="bg-mesh absolute inset-0 opacity-70" />
      <div aria-hidden className="bg-grid absolute inset-0 opacity-40" />

      {/* Floating soft blobs */}
      {!reduce && (
        <>
          <motion.div
            aria-hidden
            className="absolute top-1/4 -left-32 size-72 rounded-full bg-primary/15 blur-3xl"
            animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden
            className="absolute -right-24 bottom-1/4 size-80 rounded-full bg-[oklch(0.7_0.16_270)]/15 blur-3xl"
            animate={{ y: [0, -24, 0], x: [0, -8, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      <div className="relative z-10 mx-auto w-full max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <ECG />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-8 flex justify-center"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            <span className="relative inline-flex size-1.5 shrink-0">
              <span className="absolute inset-0 animate-ping rounded-full bg-rose-500/50" />
              <span className="relative inline-block size-1.5 rounded-full bg-rose-500" />
            </span>
            Vital signs · Page not found
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-4 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-5xl font-semibold tracking-tight text-balance text-transparent sm:text-6xl"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base"
        >
          We couldn&apos;t find a pulse on this page. It may have been moved, archived, or never
          existed in your chart. Let&apos;s get you back to safe vitals.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-7 flex flex-col items-center justify-center gap-2 sm:flex-row"
        >
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="size-4" /> Back to homepage
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link href="/dashboard">
              <LayoutDashboard className="size-4" /> Open dashboard
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-10"
        >
          <p className="mb-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Quick links
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {QUICK_LINKS.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 + i * 0.05, duration: 0.4 }}
              >
                <Link
                  href={l.href}
                  className="group flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-3 py-2.5 text-sm text-foreground backdrop-blur transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                >
                  <l.Icon className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                  <span className="font-medium">{l.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-8 flex items-center justify-center gap-3 text-[11px] text-muted-foreground"
        >
          <Link
            href="/dashboard/help"
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            <LifeBuoy className="size-3" /> Contact support
          </Link>
          <span aria-hidden>·</span>
          <button
            type="button"
            onClick={() => history.back()}
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            <ArrowLeft className="size-3" /> Go back
          </button>
          <span aria-hidden>·</span>
          <Link href="/?search=" className="inline-flex items-center gap-1 hover:text-foreground">
            <Search className="size-3" /> Search
          </Link>
        </motion.div>
      </div>
    </main>
  )
}

/* -------------------------------------------------------------------------- */
/*  Animated ECG line                                                         */
/* -------------------------------------------------------------------------- */

function ECG() {
  // Two stylised heartbeats spanning a 600x140 viewBox. The visible "pulse"
  // is achieved with a moving gradient mask along the path length.
  const path =
    'M0,70 L90,70 L110,70 L125,40 L140,100 L155,20 L170,110 L185,70 L260,70 L280,70 L295,55 L310,85 L325,70 L420,70 L435,70 L450,30 L465,110 L480,40 L495,90 L510,70 L600,70'

  return (
    <div className="relative mx-auto h-32 w-full max-w-lg">
      <div className="absolute inset-0 rounded-3xl border border-border/60 bg-card/60 shadow-[0_8px_30px_-12px_color-mix(in_oklch,var(--color-primary)_30%,transparent)] backdrop-blur" />

      {/* Top-left: device label */}
      <div className="absolute top-2 left-3 flex items-center gap-1.5 font-mono text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">
        <span className="inline-block size-1.5 animate-pulse rounded-full bg-emerald-500" />
        HealthOS · Monitor
      </div>
      <div className="absolute top-2 right-3 font-mono text-[9px] tracking-wider text-muted-foreground uppercase">
        ERR · 404
      </div>

      <svg
        viewBox="0 0 600 140"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="ecgPulse" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0" />
            <stop offset="45%" stopColor="var(--color-primary)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--color-primary)" stopOpacity="1" />
            <stop offset="55%" stopColor="var(--color-primary)" stopOpacity="0" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
            <animate
              attributeName="x1"
              from="-100%"
              to="100%"
              dur="2.4s"
              repeatCount="indefinite"
            />
            <animate attributeName="x2" from="0%" to="200%" dur="2.4s" repeatCount="indefinite" />
          </linearGradient>
          <linearGradient id="ecgGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--color-primary)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
            <animate
              attributeName="x1"
              from="-100%"
              to="100%"
              dur="2.4s"
              repeatCount="indefinite"
            />
            <animate attributeName="x2" from="0%" to="200%" dur="2.4s" repeatCount="indefinite" />
          </linearGradient>
        </defs>

        {/* Baseline trace */}
        <path
          d={path}
          fill="none"
          stroke="color-mix(in oklch, var(--color-primary) 35%, transparent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Glow pulse */}
        <path
          d={path}
          fill="none"
          stroke="url(#ecgGlow)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bright pulse */}
        <path
          d={path}
          fill="none"
          stroke="url(#ecgPulse)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Bottom readout chips */}
      <div className="absolute inset-x-3 bottom-2 flex items-center justify-between font-mono text-[9px] tracking-wider text-muted-foreground uppercase">
        <span>HR · -- bpm</span>
        <span>SpO₂ · --%</span>
        <span>BP · --/--</span>
      </div>
    </div>
  )
}
