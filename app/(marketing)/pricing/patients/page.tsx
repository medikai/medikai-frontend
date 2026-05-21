import type { Metadata } from 'next'
import Link from 'next/link'
import { PatientPricingSection } from '@/components/marketing/sections/patient-pricing-section'
import { Container } from '@/components/shared/container'

export const metadata: Metadata = {
  title: 'Patient pricing · HealthOS',
  description:
    'HealthOS patient plans — appointments, ABHA linkage, timelines, and family profiles.',
}

export default function PatientsPricingPage() {
  return (
    <>
      <Container className="py-10">
        <Link href="/pricing" className="text-sm font-medium text-primary hover:underline">
          ← All pricing
        </Link>
      </Container>
      <PatientPricingSection />
    </>
  )
}
