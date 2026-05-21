import type { Metadata } from 'next'
import { CreditCard } from 'lucide-react'
import { SubscriptionView } from '@/components/dashboard/subscription/subscription-view'

export const metadata: Metadata = { title: 'Subscription · HealthOS' }

export default function SubscriptionPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="hidden size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:inline-flex">
            <CreditCard className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Subscription</h1>
            <p className="text-sm text-muted-foreground">
              Manage your plan, seats, billing cycle and invoices.
            </p>
          </div>
        </div>
      </div>
      <SubscriptionView />
    </div>
  )
}
