'use client'

import Link from 'next/link'
import { ActionIcon, Group } from '@mantine/core'
import { Container } from '@/components/shared/container'
import { Logo } from '@/components/shared/logo'
import { Github, Twitter, Linkedin } from 'lucide-react'

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { href: '#features', label: 'Features' },
      { href: '#ai', label: 'AI Insights' },
      { href: '#workflow', label: 'Workflow' },
      { href: '#metrics', label: 'Metrics' },
      { href: '/pricing', label: 'Pricing' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { href: '/register/facility', label: 'Facility registration' },
      { href: '/register/doctor', label: 'For Clinicians' },
      { href: '/register/patient', label: 'For Patients' },
      { href: '/pricing/doctors', label: 'Clinic pricing' },
      { href: '/pricing/patients', label: 'Patient pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '#', label: 'About' },
      { href: '#', label: 'Careers' },
      { href: '#', label: 'Contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '#', label: 'Privacy' },
      { href: '#', label: 'Terms' },
      { href: '#', label: 'ABHA' },
      { href: '#', label: 'Security' },
    ],
  },
] as const

export function MarketingFooter() {
  return (
    <footer className="relative border-t border-border/60 bg-card/30">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-4">
            <Logo size="lg" />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              The operating system for modern healthcare. Unify patients, doctors, labs and staff in
              a single secure, AI-native platform.
            </p>
            <Group gap="xs">
              {[
                { Icon: Twitter, label: 'Twitter' },
                { Icon: Linkedin, label: 'LinkedIn' },
                { Icon: Github, label: 'GitHub' },
              ].map(({ Icon, label }) => (
                <ActionIcon
                  key={label}
                  component={Link}
                  href="#"
                  aria-label={label}
                  variant="default"
                  radius={999}
                  size="lg"
                  styles={{
                    root: {
                      border: '1px solid color-mix(in oklch, var(--mantine-color-default-border) 80%, transparent)',
                    },
                  }}
                >
                  <Icon className="size-4" />
                </ActionIcon>
              ))}
            </Group>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {COLUMNS.map((col) => (
              <div key={col.title} className="space-y-3">
                <h4 className="text-xs font-semibold tracking-wider text-foreground uppercase">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} HealthOS. Licensed institutional healthcare software.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for clinicians. Designed for patients.
          </p>
        </div>
      </Container>
    </footer>
  )
}
