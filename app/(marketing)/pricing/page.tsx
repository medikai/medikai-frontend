import type { Metadata } from 'next'
import Link from 'next/link'
import { PricingSection } from '@/components/marketing/sections/pricing-section'
import { PatientPricingSection } from '@/components/marketing/sections/patient-pricing-section'
import { Container } from '@/components/shared/container'

export const metadata: Metadata = {
  title: 'Pricing · HealthOS',
  description:
    'Compare HealthOS subscription plans for doctors, clinics, and patients. ABHA-ready, MVP Phase 1 pricing.',
}

export default function PricingPage() {
  return (
    <>
      <div className="border-b border-border/60 bg-card/40 py-12">
        <Container>
          <p className="text-xs font-semibold tracking-wider text-primary uppercase">MVP Phase 1</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Subscription & pricing
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Facility onboarding, clinician seats, reception workflows, and patient plans — choose
            the path that fits your rollout.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/pricing/doctors"
              className="rounded-lg border border-border/60 bg-card px-4 py-2 text-sm font-medium shadow-sm hover:border-primary/40"
            >
              Doctors & clinics only
            </Link>
            <Link
              href="/pricing/patients"
              className="rounded-lg border border-border/60 bg-card px-4 py-2 text-sm font-medium shadow-sm hover:border-primary/40"
            >
              Patients & families only
            </Link>
          </div>
        </Container>
      </div>
      <PricingSection />
      <PatientPricingSection />
    </>
  )
}
