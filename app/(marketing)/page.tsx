import type { Metadata } from 'next'
import { HeroSection } from '@/components/marketing/sections/hero-section'
import { LogoCloud } from '@/components/marketing/sections/logo-cloud'
import { FeaturesSection } from '@/components/marketing/sections/features-section'
import { AISection } from '@/components/marketing/sections/ai-section'
import { MetricsSection } from '@/components/marketing/sections/metrics-section'
import { WorkflowSection } from '@/components/marketing/sections/workflow-section'
import { StatsSection } from '@/components/marketing/sections/stats-section'
import { PricingSection } from '@/components/marketing/sections/pricing-section'
import { PatientPricingSection } from '@/components/marketing/sections/patient-pricing-section'
import { CTASection } from '@/components/marketing/sections/cta-section'

export const metadata: Metadata = {
  title: 'HealthOS — The Operating System for Modern Healthcare',
  description:
    'MVP Phase 1: facility, doctor & patient registration, appointments, and reception workflows. ABHA‑ready, demo‑ready platform.',
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LogoCloud />
      <FeaturesSection />
      <AISection />
      <MetricsSection />
      <WorkflowSection />
      <StatsSection />
      <PricingSection />
      <PatientPricingSection />
      <CTASection />
    </>
  )
}
