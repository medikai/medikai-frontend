'use client'

import { motion } from 'motion/react'
import { Quote } from 'lucide-react'
import { Container } from '@/components/shared/container'
import { Section, Eyebrow } from '@/components/shared/section'
import { SectionHeadingRhythm } from '@/components/shared/rhythm'
import { rhythmContainer, fadeInUp } from '@/lib/motion'

const TESTIMONIALS = [
  {
    quote:
      'HealthOS gave our 14‑clinic group a single source of truth. The AI co‑pilot alone saves our doctors an hour a day.',
    name: 'Dr. Anita Rao',
    role: 'Chief Medical Officer, Meridian Health',
  },
  {
    quote:
      'The migration was painless. Within six weeks we deprecated three legacy systems and improved patient satisfaction by 22%.',
    name: 'James Okafor',
    role: 'CIO, Northcare',
  },
  {
    quote:
      'Patients finally understand their results. The plain‑language summaries are a game changer for engagement.',
    name: 'Dr. Maya Lin',
    role: 'Family Physician, Bluerock Clinic',
  },
] as const

export function TestimonialsSection() {
  return (
    <Section id="testimonials" spacing="lg">
      <Container>
        <SectionHeadingRhythm
          eyebrow={<Eyebrow>Customers</Eyebrow>}
          title={
            <>
              Loved by clinicians. <span className="text-primary">Trusted by leaders</span>.
            </>
          }
          description="From solo practices to multi‑hospital systems, teams switch to HealthOS for the design, the speed, and the outcomes."
        />

        <motion.div
          variants={rhythmContainer('cards')}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-14 grid gap-5 md:grid-cols-3"
        >
          {TESTIMONIALS.map((t) => (
            <motion.figure
              key={t.name}
              variants={fadeInUp}
              className="relative flex flex-col rounded-2xl border border-border/60 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <Quote className="size-7 text-primary/30" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90 sm:text-base">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border/60 pt-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {t.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </Container>
    </Section>
  )
}
