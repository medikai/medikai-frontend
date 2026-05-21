import type { Metadata } from 'next'
import Link from 'next/link'
import { PricingSection } from '@/components/marketing/sections/pricing-section'
import { Container } from '@/components/shared/container'

export const metadata: Metadata = {
  title: 'Doctor & clinic pricing · HealthOS',
  description: 'Seat-based pricing for clinicians. Doctor administration included on Growth+.',
}

export default function DoctorsPricingPage() {
  return (
    <>
      <Container className="py-10">
        <Link href="/pricing" className="text-sm font-medium text-primary hover:underline">
          ← All pricing
        </Link>
      </Container>
      <PricingSection />
    </>
  )
}
