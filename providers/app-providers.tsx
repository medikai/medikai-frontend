'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { MantineAppProvider } from '@/providers/mantine-app-provider'
import type { ThemeProviderProps } from 'next-themes'

type AppProvidersProps = {
  children: React.ReactNode
  themeProps?: Omit<ThemeProviderProps, 'children'>
}

export function AppProviders({ children, themeProps }: AppProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...themeProps}
    >
      <MantineAppProvider defaultColorScheme="auto">{children}</MantineAppProvider>
    </ThemeProvider>
  )
}
