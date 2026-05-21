'use client'

import { motion } from 'motion/react'
import { Sparkles, Brain, Bot, ScanText } from 'lucide-react'
import { Container } from '@/components/shared/container'
import { Section, Eyebrow } from '@/components/shared/section'
import { SectionHeadingRhythm } from '@/components/shared/rhythm'
import { Reveal } from '@/components/shared/reveal'
import { rhythmContainer, fadeInUp } from '@/lib/motion'

export function AISection() {
  return (
    <Section id="ai" spacing="lg" className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <Container>
        <SectionHeadingRhythm
          eyebrow={<Eyebrow icon={<Sparkles className="size-3" />}>AI Co‑pilot</Eyebrow>}
          title={
            <>
              Intelligence woven into <span className="text-primary">every workflow</span>.
            </>
          }
          description="Trained on clinical workflows, our co‑pilot summarizes encounters, drafts notes, and surfaces what matters — never a black box, always reviewable."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <div className="relative h-full overflow-hidden rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
              <div
                aria-hidden
                className="absolute -top-24 -right-24 size-72 rounded-full bg-primary/10 blur-3xl"
              />
              <div className="relative">
                <p className="inline-flex items-center gap-2 text-xs font-medium text-primary">
                  <Bot className="size-3.5 shrink-0" />
                  Live AI summary
                </p>

                <div className="mt-5 space-y-3">
                  {[
                    {
                      from: 'patient',
                      text: 'I have a sharp chest pain that started this morning, radiating to my left arm.',
                    },
                    {
                      from: 'ai',
                      text: 'Flagged as urgent. Possible cardiac symptom — recommend ECG within 10 minutes and notifying on‑call cardiologist.',
                    },
                    {
                      from: 'patient',
                      text: 'I also have a history of hypertension and take Lisinopril.',
                    },
                    {
                      from: 'ai',
                      text: 'Pulled medication history. No known interactions with current acute protocol. Drafting consult note for Dr. Patel.',
                    },
                  ].map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ delay: i * 0.12, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      className={
                        m.from === 'ai'
                          ? 'max-w-[88%] rounded-2xl rounded-tl-md border border-primary/20 bg-primary/5 p-3.5 text-sm text-foreground/90'
                          : 'ml-auto max-w-[88%] rounded-2xl rounded-tr-md border border-border/60 bg-background p-3.5 text-sm text-foreground/90'
                      }
                    >
                      {m.from === 'ai' && (
                        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium text-primary">
                          <Sparkles className="size-3" /> HealthOS AI
                        </div>
                      )}
                      {m.text}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <motion.div
            className="grid gap-4 lg:col-span-2"
            variants={rhythmContainer('tight')}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              {
                Icon: Brain,
                title: 'Clinical reasoning',
                desc: 'Surfaces differentials, drug interactions and red flags from the full chart context.',
              },
              {
                Icon: ScanText,
                title: 'Auto documentation',
                desc: 'Drafts SOAP notes from encounters in seconds — clinician always approves.',
              },
              {
                Icon: Sparkles,
                title: 'Personalized for patients',
                desc: 'Translates results into plain language, with culturally aware tone and language support.',
              },
            ].map((f) => (
              <motion.div key={f.title} variants={fadeInUp}>
                <div className="rounded-2xl border border-border/60 bg-card p-5 transition-colors hover:border-primary/30">
                  <div className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <f.Icon className="size-5" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </Section>
  )
}
