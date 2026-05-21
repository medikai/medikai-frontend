'use client'

import {
  Stethoscope,
  CalendarCheck,
  FlaskConical,
  ShieldCheck,
  MessagesSquare,
  LineChart,
} from 'lucide-react'
import { Container } from '@/components/shared/container'
import { Section, Eyebrow } from '@/components/shared/section'
import { SectionHeadingRhythm } from '@/components/shared/rhythm'
import { rhythmContainer, fadeInUp } from '@/lib/motion'
import { motion } from 'motion/react'

const FEATURES = [
  {
    icon: Stethoscope,
    title: 'Unified clinical workspace',
    description:
      'A single workspace for consultations, prescriptions and notes — designed with clinicians, not for them.',
  },
  {
    icon: CalendarCheck,
    title: 'Smart scheduling',
    description:
      'Auto‑routes appointments based on specialty, availability and patient acuity to minimize wait time.',
  },
  {
    icon: FlaskConical,
    title: 'Lab & diagnostics',
    description:
      'Order, track and review labs in one place with structured results and trend visualization.',
  },
  {
    icon: MessagesSquare,
    title: 'Secure messaging',
    description:
      'ABHA‑aligned messaging across patients, clinicians and staff with full audit trails.',
  },
  {
    icon: LineChart,
    title: 'Operational analytics',
    description:
      'Real‑time dashboards for throughput, occupancy and outcomes to power better decisions.',
  },
  {
    icon: ShieldCheck,
    title: 'Enterprise‑grade security',
    description:
      'SOC 2‑aligned controls, granular RBAC, audit logs and end‑to‑end encryption by default.',
  },
] as const

export function FeaturesSection() {
  return (
    <Section id="features" spacing="lg" className="relative">
      <Container>
        <SectionHeadingRhythm
          eyebrow={<Eyebrow>Platform</Eyebrow>}
          title={
            <>
              Everything your clinic needs, <span className="text-primary">in one OS</span>.
            </>
          }
          description="HealthOS replaces a stack of disconnected tools with a single coherent platform — beautifully designed and ready for enterprise scale."
        />

        <motion.div
          variants={rhythmContainer('cards')}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className="group relative rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.04] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                  <f.icon className="size-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  )
}
