'use client'

import { ColorSchemeToggle } from '@/components/mantine/color-scheme-toggle'
import { cn } from '@/lib/utils'

/** Mantine-backed theme toggle; keeps the legacy `ThemeToggle` import path. */
export function ThemeToggle({ className }: { className?: string }) {
  return <ColorSchemeToggle size="md" className={cn('size-9', className)} />
}
