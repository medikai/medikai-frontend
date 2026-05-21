'use client'

import { motion } from 'motion/react'
import { CalendarCheck, ClipboardList, Stethoscope, FileCheck2 } from 'lucide-react'
import { Container } from '@/components/shared/container'
import { Section, Eyebrow } from '@/components/shared/section'
import { SectionHeadingRhythm } from '@/components/shared/rhythm'
import { rhythmContainer, fadeInUp } from '@/lib/motion'

const STEPS = [
  {
    Icon: CalendarCheck,
    title: 'Book',
    desc: 'Patient self‑schedules in seconds with smart specialty routing.',
  },
  {
    Icon: ClipboardList,
    title: 'Intake',
    desc: 'Pre‑visit forms and vitals sync automatically into the chart.',
  },
  {
    Icon: Stethoscope,
    title: 'Consult',
    desc: 'Clinician reviews AI summary, examines, prescribes — in one place.',
  },
  {
    Icon: FileCheck2,
    title: 'Follow‑up',
    desc: 'Automated reminders, lab orders and care plans go out instantly.',
  },
] as const

export function WorkflowSection() {
  return (
    <Section id="workflow" spacing="lg" className="relative border-y border-border/60 bg-card/30">
      <Container>
        <SectionHeadingRhythm
          eyebrow={<Eyebrow>Workflow</Eyebrow>}
          title={
            <>
              From booking to follow‑up, <span className="text-primary">in minutes</span>.
            </>
          }
          description="A connected patient journey, with every handoff automated and every detail captured."
        />

        <motion.ol
          variants={rhythmContainer('cards')}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="relative mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div
            aria-hidden
            className="absolute top-12 right-12 left-12 hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent lg:block"
          />
          {STEPS.map((s, i) => (
            <motion.li key={s.title} variants={fadeInUp} className="relative">
              <div className="rounded-2xl border border-border/60 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <div className="flex items-center justify-between">
                  <div className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                    <s.Icon className="size-5" />
                  </div>
                  <span className="font-mono text-xs font-semibold text-muted-foreground/60">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </Container>
    </Section>
  )
}
