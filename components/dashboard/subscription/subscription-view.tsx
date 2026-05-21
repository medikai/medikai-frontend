'use client'

import * as React from 'react'
import { motion, LayoutGroup } from 'motion/react'
import {
  ArrowUpRight,
  Check,
  CreditCard,
  Download,
  HardDrive,
  Receipt,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  CURRENT_SUBSCRIPTION,
  INVOICES,
  PLANS,
  type BillingCycle,
  type Plan,
} from '@/lib/data/subscription'

const CYCLES: { id: BillingCycle; label: string; saving?: string }[] = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'quarterly', label: 'Quarterly', saving: 'Save 10%' },
  { id: 'annually', label: 'Annually', saving: 'Save 20%' },
]

export function SubscriptionView() {
  const [cycle, setCycle] = React.useState<BillingCycle>('monthly')
  const current = PLANS.find((p) => p.id === CURRENT_SUBSCRIPTION.planId)!

  return (
    <div className="space-y-10">
      <CurrentPlanPanel current={current} />

      <section className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Plans & pricing</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Per‑seat pricing. Scale doctors, staff and patients as you grow.
            </p>
          </div>
          <CycleToggle value={cycle} onChange={setCycle} />
        </div>

        <LayoutGroup>
          <div className="grid gap-5 lg:grid-cols-3">
            {PLANS.map((plan, i) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                cycle={cycle}
                isCurrent={plan.id === current.id}
                index={i}
              />
            ))}
          </div>
        </LayoutGroup>
      </section>

      <BillingHistory />
    </div>
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
    <div className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-card p-1">
      {CYCLES.map((c) => {
        const active = value === c.id
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className={cn(
              'relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors',
              active ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {active && (
              <motion.span
                layoutId="cycle-pill"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: 'spring', stiffness: 360, damping: 32 }}
              />
            )}
            <span className="relative">{c.label}</span>
            {c.saving && (
              <span
                className={cn(
                  'relative rounded-full px-1.5 py-px text-[9px] font-semibold tracking-wider uppercase',
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

function PricingCard({
  plan,
  cycle,
  isCurrent,
  index,
}: {
  plan: Plan
  cycle: BillingCycle
  isCurrent: boolean
  index: number
}) {
  const price = plan.pricePerSeat[cycle]
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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
          <Badge className="absolute top-4 right-4 gap-1 bg-primary text-primary-foreground">
            <Star className="size-3 fill-current" /> Most popular
          </Badge>
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

        <Button
          variant={plan.popular ? 'default' : 'outline'}
          className="mt-5 w-full"
          disabled={isCurrent}
        >
          {isCurrent ? 'Current plan' : plan.cta}
          {!isCurrent && <ArrowUpRight className="size-4" />}
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

function CurrentPlanPanel({ current }: { current: Plan }) {
  const sub = CURRENT_SUBSCRIPTION
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-transparent" />
      <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex flex-wrap items-center gap-4">
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight">{current.name} plan</h2>
              <Badge variant="secondary" className="capitalize">
                {sub.cycle}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Renews on{' '}
              <span className="font-medium text-foreground">
                {new Date(sub.renewsOn).toLocaleDateString(undefined, {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>{' '}
              · ${current.pricePerSeat[sub.cycle] * sub.seats.total}/mo
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm">
            Manage seats
          </Button>
          <Button size="sm" className="gap-1.5">
            <TrendingUp className="size-4" /> Upgrade
          </Button>
        </div>
      </div>

      <div className="relative mt-6 grid gap-3 sm:grid-cols-3">
        <UsageMeter
          icon={<Users className="size-4" />}
          label="Seats"
          used={sub.seats.used}
          total={sub.seats.total}
          unit="seats"
        />
        <UsageMeter
          icon={<CreditCard className="size-4" />}
          label="Patients"
          used={sub.patients.used}
          total={sub.patients.total}
          unit="patients"
        />
        <UsageMeter
          icon={<HardDrive className="size-4" />}
          label="Storage"
          used={sub.storageGb.used}
          total={sub.storageGb.total}
          unit="GB"
          decimals
        />
      </div>
    </motion.div>
  )
}

function UsageMeter({
  icon,
  label,
  used,
  total,
  unit,
  decimals,
}: {
  icon: React.ReactNode
  label: string
  used: number
  total: number | 'unlimited'
  unit: string
  decimals?: boolean
}) {
  const pct = total === 'unlimited' ? 0 : Math.min(100, Math.round((used / total) * 100))
  const fmt = (n: number) =>
    decimals ? n.toFixed(1) : n >= 1000 ? n.toLocaleString() : n.toString()
  const high = pct >= 90
  return (
    <div className="rounded-xl border border-border/60 bg-background/50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="text-primary">{icon}</span>
          {label}
        </div>
        <span className="text-[11px] font-medium text-muted-foreground tabular-nums">
          {fmt(used)} / {total === 'unlimited' ? '∞' : fmt(total)} {unit}
        </span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className={cn(
            'h-full rounded-full',
            high
              ? 'bg-rose-500'
              : pct > 70
                ? 'bg-amber-500'
                : 'bg-gradient-to-r from-primary to-[oklch(0.65_0.18_220)]',
          )}
          initial={{ width: 0 }}
          animate={{ width: total === 'unlimited' ? '8%' : `${pct}%` }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      {high && (
        <p className="mt-2 text-[11px] text-rose-600 dark:text-rose-400">
          Approaching limit — consider upgrading.
        </p>
      )}
    </div>
  )
}

function BillingHistory() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Billing history</h2>
          <p className="text-sm text-muted-foreground">Last 5 invoices · download PDF</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Receipt className="size-4" /> View all
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
        <div className="hidden grid-cols-12 gap-3 border-b border-border/60 px-5 py-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase sm:grid">
          <div className="col-span-2">Invoice</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-5">Description</div>
          <div className="col-span-1 text-right">Amount</div>
          <div className="col-span-2 text-right">Status</div>
        </div>
        {INVOICES.map((inv, i) => (
          <motion.div
            key={inv.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.4 }}
            className="grid grid-cols-2 gap-3 border-b border-border/60 px-5 py-3.5 text-sm last:border-0 hover:bg-accent/40 sm:grid-cols-12 sm:items-center"
          >
            <div className="col-span-1 font-mono text-xs font-medium sm:col-span-2">
              {inv.number}
            </div>
            <div className="col-span-1 text-xs text-muted-foreground sm:col-span-2">
              {new Date(inv.date).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            <div className="col-span-2 truncate text-muted-foreground sm:col-span-5">
              {inv.description}
            </div>
            <div className="col-span-1 text-right font-semibold tabular-nums sm:col-span-1">
              ${inv.amount.toLocaleString()}
            </div>
            <div className="col-span-1 flex items-center justify-end gap-2 sm:col-span-2">
              <Badge
                variant="outline"
                className={cn(
                  'capitalize',
                  inv.status === 'paid' &&
                    'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
                  inv.status === 'open' &&
                    'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
                  inv.status === 'overdue' &&
                    'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300',
                )}
              >
                {inv.status}
              </Badge>
              <Button variant="ghost" size="icon" className="size-7" aria-label="Download invoice">
                <Download className="size-3.5" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
