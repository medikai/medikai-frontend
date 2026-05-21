'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/shared/container'
import { Section } from '@/components/shared/section'
import { RevealStagger } from '@/components/shared/rhythm'
import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
    <Section spacing="lg">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-card to-card p-10 text-center sm:p-16">
          <div
            aria-hidden
            className="absolute -top-32 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]"
          />
          <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-40" />

          <RevealStagger
            className="relative mx-auto flex max-w-3xl flex-col items-center gap-5"
            preset="section"
            viewport={{ once: true, amount: 0.25 }}
          >
            <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl">
              Ready to give your team the OS <span className="text-primary">they deserve</span>?
            </h2>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              Start free in minutes. White‑glove onboarding included for clinics and hospitals.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group h-12 px-6 text-base shadow-lg shadow-primary/20"
              >
                <Link href="/register/patient">
                  Start free
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base">
                <Link href="/login">Talk to sales</Link>
              </Button>
            </div>
          </RevealStagger>
        </div>
      </Container>
    </Section>
  )
}
