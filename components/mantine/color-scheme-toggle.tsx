'use client'

import { ActionIcon, Tooltip, useMantineColorScheme } from '@mantine/core'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

type ColorSchemeToggleProps = {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ColorSchemeToggle({ size = 'md', className }: ColorSchemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme()
  const { colorScheme } = useMantineColorScheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = mounted ? (resolvedTheme ?? colorScheme) === 'dark' : false

  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 22 : 18

  return (
    <Tooltip label={isDark ? 'Light mode' : 'Dark mode'}>
      <ActionIcon
        className={className}
        variant="default"
        size={size}
        radius="xl"
        aria-label="Toggle color scheme"
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
      >
        {isDark ? <Sun size={iconSize} /> : <Moon size={iconSize} />}
      </ActionIcon>
    </Tooltip>
  )
}
