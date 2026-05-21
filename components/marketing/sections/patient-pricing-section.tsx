'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PATIENT_PLANS, type PatientPlan } from '@/lib/data/subscription'
import { rhythmContainer, fadeInUp } from '@/lib/motion'
import Link from 'next/link'

export function PatientPricingSection() {
  return (
    <section id="pricing-patients" className="border-t border-border/60 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          variants={rhythmContainer('section')}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
        >
          <motion.h2 variants={fadeInUp} className="text-3xl font-bold tracking-tight sm:text-4xl">
            Plans for patients & families
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 text-lg text-muted-foreground">
            Keep your health records, appointments, and ABHA-linked profile in one secure app.
          </motion.p>
        </motion.div>

        <motion.div
          variants={rhythmContainer('tight')}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {PATIENT_PLANS.map((plan) => (
            <PatientPlanCard key={plan.id} plan={plan} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function PatientPlanCard({ plan }: { plan: PatientPlan }) {
  return (
    <motion.div
      variants={fadeInUp}
      className={cn(
        'relative flex flex-col overflow-hidden rounded-2xl border bg-card p-6',
        plan.popular
          ? 'border-primary/40 shadow-[0_8px_30px_-12px_color-mix(in_oklch,var(--color-primary)_40%,transparent)]'
          : 'border-border/60',
      )}
    >
      {plan.popular ? (
        <span className="absolute top-4 right-4 text-xs font-semibold text-primary">Popular</span>
      ) : null}
      <h3 className="text-lg font-semibold">{plan.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
      <div className="mt-6">
        <span className="text-4xl font-semibold tracking-tight tabular-nums">
          {plan.priceMonthly === 0 ? 'Free' : `₹${plan.priceMonthly}`}
        </span>
        {plan.priceMonthly > 0 ? (
          <span className="text-sm text-muted-foreground"> / month</span>
        ) : null}
      </div>
      <Button asChild className="mt-6 w-full" variant={plan.popular ? 'default' : 'outline'}>
        <Link href="/register/patient">{plan.cta}</Link>
      </Button>
      <ul className="mt-6 flex-1 space-y-2.5 text-sm">
        {plan.highlights.map((h) => (
          <li key={h} className="flex gap-2">
            <span className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Check className="size-3" />
            </span>
            <span className="text-foreground/90">{h}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
