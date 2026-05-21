'use client'

import { motion } from 'motion/react'
import { Container } from '@/components/shared/container'
import { fadeInUp, rhythmContainer } from '@/lib/motion'

const LOGOS = [
  'MERIDIAN HEALTH',
  'NORTHCARE',
  'PULSE LABS',
  'BLUEROCK CLINIC',
  'AURA HOSPITALS',
  'VITALWORKS',
]

export function LogoCloud() {
  return (
    <section className="relative border-y border-border/60 bg-card/30 py-12">
      <Container>
        <motion.div
          className="text-center"
          variants={rhythmContainer('tight')}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
        >
          <motion.p
            variants={fadeInUp}
            className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
          >
            Trusted by forward‑thinking healthcare teams
          </motion.p>
          <div className="mt-8 grid grid-cols-2 items-center justify-items-center gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
            {LOGOS.map((name) => (
              <motion.div key={name} variants={fadeInUp}>
                <div className="text-sm font-semibold tracking-[0.18em] text-muted-foreground/70 transition-colors hover:text-foreground">
                  {name}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
