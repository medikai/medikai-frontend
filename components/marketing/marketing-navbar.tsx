'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion, useScroll, useMotionValueEvent } from 'motion/react'
import { Menu, X, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/shared/container'
import { Logo } from '@/components/shared/logo'
import { ThemeToggle } from '@/components/shared/theme-toggle'

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#ai', label: 'AI' },
  { href: '#workflow', label: 'Workflow' },
  { href: '#metrics', label: 'Metrics' },
  { href: '/pricing', label: 'Pricing' },
] as const

export function MarketingNavbar() {
  const [scrolled, setScrolled] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 12))

  React.useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Logo priority />

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative rounded-md px-3 py-2 text-sm font-medium text-muted-foreground ring-focus transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild size="sm" className="group">
              <Link href="/register/patient">
                Get started
                <ArrowRight className="ml-1.5 size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>
      </Container>

      <motion.div
        initial={false}
        animate={open ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden"
      >
        <Container className="py-4">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button asChild variant="outline">
                <Link href="/login" onClick={() => setOpen(false)}>
                  Sign in
                </Link>
              </Button>
              <Button asChild>
                <Link href="/register/patient" onClick={() => setOpen(false)}>
                  Get started
                </Link>
              </Button>
            </div>
          </nav>
        </Container>
      </motion.div>
    </motion.header>
  )
}
