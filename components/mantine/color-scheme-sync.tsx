'use client'

import { useMantineColorScheme } from '@mantine/core'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'

/** Keeps Mantine color scheme in sync with next-themes (class on `<html>`). */
export function MantineColorSchemeSync() {
  const { setColorScheme } = useMantineColorScheme()
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (resolvedTheme === 'light' || resolvedTheme === 'dark') {
      setColorScheme(resolvedTheme)
    }
  }, [resolvedTheme, setColorScheme])

  return null
}
