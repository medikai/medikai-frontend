'use client'

import * as React from 'react'
import { motion, LayoutGroup } from 'motion/react'
import { ArrowUpRight, Check, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PLANS, type BillingCycle, type Plan } from '@/lib/data/subscription'
import { rhythmContainer, fadeInUp } from '@/lib/motion'

const CYCLES: { id: BillingCycle; label: string; saving?: string }[] = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'quarterly', label: 'Quarterly', saving: 'Save 10%' },
  { id: 'annually', label: 'Annually', saving: 'Save 20%' },
]

export function PricingSection() {
  const [cycle, setCycle] = React.useState<BillingCycle>('monthly')

  return (
    <section id="pricing-doctors" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          variants={rhythmContainer('section')}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
        >
          <motion.h2 variants={fadeInUp} className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 text-lg text-muted-foreground">
            Per‑seat pricing for clinics and Doctor admin tools on Growth+. ABHA-aligned security.
          </motion.p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          className="mt-8 flex justify-center"
        >
          <CycleToggle value={cycle} onChange={setCycle} />
        </motion.div>

        <LayoutGroup>
          <motion.div
            className="mt-12 grid gap-6 lg:grid-cols-3"
            variants={rhythmContainer('tight')}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
          >
            {PLANS.map((plan) => (
              <PricingCard key={plan.id} plan={plan} cycle={cycle} />
            ))}
          </motion.div>
        </LayoutGroup>
      </div>
    </section>
  )
}

function CycleToggle({
  value,
  onChange,
}: {
  value: BillingCycle
  onChange: (v: BillingCycle) => void
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-border/60 bg-card p-1">
      {CYCLES.map((c) => {
        const active = value === c.id
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            type="button"
            className={cn(
              'relative inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors',
              active ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {active && (
              <motion.span
                layoutId="marketing-cycle-pill"
                className="absolute inset-0 rounded-md bg-primary"
                transition={{ type: 'spring', stiffness: 360, damping: 32 }}
              />
            )}
            <span className="relative">{c.label}</span>
            {c.saving && (
              <span
                className={cn(
                  'relative rounded-md px-1.5 py-px text-[9px] font-semibold tracking-wider uppercase',
                  active
                    ? 'bg-primary-foreground/20'
                    : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
                )}
              >
                {c.saving}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

function PricingCard({ plan, cycle }: { plan: Plan; cycle: BillingCycle }) {
  const price = plan.pricePerSeat[cycle]
  return (
    <motion.div
      layout
      variants={fadeInUp}
      whileHover={{ y: -4 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border bg-card p-6 transition-shadow',
        plan.popular
          ? 'border-primary/40 shadow-[0_8px_30px_-12px_color-mix(in_oklch,var(--color-primary)_40%,transparent)]'
          : 'border-border/60 hover:shadow-lg hover:shadow-primary/5',
      )}
    >
      {plan.popular && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-transparent" />
          <span className="absolute top-4 right-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
            <Star className="size-3.5 shrink-0" aria-hidden /> Most popular
          </span>
        </>
      )}

      <div className="relative">
        <h3 className="text-lg font-semibold">{plan.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>

        <div className="mt-6 flex items-baseline gap-1">
          <motion.span
            key={price}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="text-4xl font-semibold tracking-tight tabular-nums"
          >
            ${price}
          </motion.span>
          <span className="text-sm text-muted-foreground">/seat / mo</span>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">Billed {cycle}. Cancel anytime.</p>

        <Button variant={plan.popular ? 'default' : 'outline'} className="mt-5 w-full" asChild>
          <a href="/register">
            {plan.cta}
            <ArrowUpRight className="size-4" />
          </a>
        </Button>

        <ul className="mt-6 space-y-2.5 text-sm">
          {plan.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2">
              <span className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Check className="size-3" />
              </span>
              <span className="text-foreground/90">{h}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 grid grid-cols-2 gap-2 text-[11px]">
          <LimitChip label="Doctors" value={plan.limits.doctors} />
          <LimitChip label="Staff" value={plan.limits.staff} />
          <LimitChip label="Patients" value={plan.limits.patients} />
          <LimitChip
            label="Storage"
            value={
              plan.limits.storageGb === 'unlimited' ? 'unlimited' : `${plan.limits.storageGb} GB`
            }
          />
        </div>
      </div>
    </motion.div>
  )
}

function LimitChip({ label, value }: { label: string; value: number | string }) {
  const display =
    typeof value === 'number'
      ? value >= 1000
        ? `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`
        : value
      : value
  return (
    <div className="rounded-lg border border-border/60 bg-background/50 px-2.5 py-1.5">
      <div className="text-muted-foreground">{label}</div>
      <div className="font-semibold text-foreground capitalize tabular-nums">{display}</div>
    </div>
  )
}
