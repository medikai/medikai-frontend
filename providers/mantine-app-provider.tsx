'use client'

import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { MantineColorSchemeSync } from '@/components/mantine/color-scheme-sync'
import { healthOsTheme } from '@/theme/mantine-theme'

type MantineAppProviderProps = {
  children: React.ReactNode
  defaultColorScheme?: 'light' | 'dark' | 'auto'
}

export function MantineAppProvider({
  children,
  defaultColorScheme = 'auto',
}: MantineAppProviderProps) {
  return (
    <MantineProvider theme={healthOsTheme} defaultColorScheme={defaultColorScheme}>
      <MantineColorSchemeSync />
      <Notifications position="top-right" zIndex={1000} />
      {children}
    </MantineProvider>
  )
}
