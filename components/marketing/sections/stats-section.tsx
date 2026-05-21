'use client'

import { motion, useInView } from 'motion/react'
import * as React from 'react'
import { Container } from '@/components/shared/container'
import { Section } from '@/components/shared/section'
import { rhythmContainer, fadeInUp } from '@/lib/motion'

const STATS = [
  { value: 240, suffix: '+', label: 'Hospitals onboarded' },
  { value: 12, suffix: 'M', label: 'Patient records secured' },
  { value: 99.99, suffix: '%', label: 'Uptime SLA', decimals: 2 },
  { value: 38, suffix: '%', label: 'Less time on admin' },
] as const

function CountUp({
  to,
  decimals = 0,
  suffix = '',
}: {
  to: number
  decimals?: number
  suffix?: string
}) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [val, setVal] = React.useState(0)

  React.useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const dur = 1400
    let frame = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(to * eased)
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, to])

  return (
    <span ref={ref}>
      {val.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}

export function StatsSection() {
  return (
    <Section spacing="md">
      <Container>
        <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-primary/5 via-card to-card p-8 sm:p-12">
          <motion.div
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
            variants={rhythmContainer('cards')}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            {STATS.map((s) => (
              <motion.div key={s.label} variants={fadeInUp} className="text-center sm:text-left">
                <div className="text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
                  <CountUp
                    to={s.value}
                    suffix={s.suffix}
                    decimals={'decimals' in s ? s.decimals : 0}
                  />
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </Section>
  )
}
