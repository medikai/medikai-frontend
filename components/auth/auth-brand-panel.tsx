'use client'

import Link from 'next/link'
import { Group, Paper, Stack, Text, ThemeIcon } from '@mantine/core'
import { motion, useReducedMotion } from 'motion/react'
import { ShieldCheck, Sparkles, HeartPulse } from 'lucide-react'
import { Logo } from '@/components/shared/logo'
import { rhythmContainer, fadeInUp } from '@/lib/motion'

const HIGHLIGHTS = [
  {
    Icon: ShieldCheck,
    title: 'Bank‑grade security',
    desc: 'ABHA-aligned data practices, encryption at rest and in transit, granular RBAC.',
  },
  {
    Icon: Sparkles,
    title: 'AI co‑pilot built in',
    desc: 'Save an hour per clinician per day with intelligent summaries and drafting.',
  },
  {
    Icon: HeartPulse,
    title: 'Designed for outcomes',
    desc: 'Real‑time vitals, smart alerts and trends — patients understand their data.',
  },
] as const

function AuthHighlightCard({ h }: { h: (typeof HIGHLIGHTS)[number] }) {
  return (
    <Paper
      p="md"
      radius="xl"
      withBorder
      styles={{
        root: {
          borderColor: 'rgba(255,255,255,0.12)',
          backgroundColor: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(12px)',
        },
      }}
    >
      <Group gap="md" align="flex-start" wrap="nowrap">
        <ThemeIcon
          size={44}
          variant="light"
          color="teal"
          styles={{
            root: {
              borderRadius: 9999,
              backgroundColor: 'rgba(255,255,255,0.14)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
            },
          }}
        >
          <h.Icon className="size-[18px]" strokeWidth={2} aria-hidden />
        </ThemeIcon>
        <Stack gap={6}>
          <Text fw={600} size="sm" c="white">
            {h.title}
          </Text>
          <Text size="xs" style={{ color: 'rgba(255,255,255,0.68)', lineHeight: 1.6 }}>
            {h.desc}
          </Text>
        </Stack>
      </Group>
    </Paper>
  )
}

export function AuthBrandPanel() {
  const reduce = useReducedMotion()

  return (
    <aside className="relative hidden flex-col justify-between overflow-hidden p-10 text-white lg:flex xl:p-12">
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(135deg,oklch(0.32_0.08_220)_0%,oklch(0.28_0.08_240)_50%,oklch(0.22_0.06_260)_100%)]"
      />
      <div aria-hidden className="bg-grid absolute inset-0 opacity-20" />
      <div
        aria-hidden
        className="absolute -top-32 -right-24 size-[520px] rounded-full bg-primary/40 blur-[120px]"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-24 size-[520px] rounded-full bg-[oklch(0.6_0.18_270)/0.35] blur-[120px]"
      />

      <div className="relative">
        <Logo href="/" priority onDark />
      </div>

      {reduce ? (
        <div className="relative max-w-md space-y-8">
          <h2 className="text-3xl font-semibold tracking-tight text-balance text-white xl:text-4xl">
            The operating system for modern healthcare.
          </h2>
          <p className="leading-relaxed text-white/70">
            Join thousands of clinicians and patients who trust HealthOS to power safer, more
            personal care — every day.
          </p>
          <ul className="space-y-4">
            {HIGHLIGHTS.map((h) => (
              <li key={h.title}>
                <AuthHighlightCard h={h} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <motion.div
          className="relative max-w-md space-y-8"
          variants={rhythmContainer('section')}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl font-semibold tracking-tight text-balance text-white xl:text-4xl"
          >
            The operating system for modern healthcare.
          </motion.h2>
          <motion.p variants={fadeInUp} className="leading-relaxed text-white/70">
            Join thousands of clinicians and patients who trust HealthOS to power safer, more
            personal care — every day.
          </motion.p>

          <motion.ul variants={rhythmContainer('tight')} className="space-y-4">
            {HIGHLIGHTS.map((h) => (
              <motion.li key={h.title} variants={fadeInUp}>
                <AuthHighlightCard h={h} />
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      )}

      <div className="relative flex items-center justify-between text-xs text-white/50">
        <span>© {new Date().getFullYear()} HealthOS</span>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-white">
            Privacy
          </Link>
          <Link href="#" className="hover:text-white">
            Terms
          </Link>
          <Link href="#" className="hover:text-white">
            ABHA
          </Link>
        </div>
      </div>
    </aside>
  )
}
