import { createTheme } from '@mantine/core'

/** HealthOS brand palette — teal aligned with app CSS tokens. */
export const healthOsTheme = createTheme({
  primaryColor: 'teal',
  fontFamily: 'var(--font-sans), system-ui, sans-serif',
  fontFamilyMonospace: 'var(--font-mono), ui-monospace, monospace',
  headings: {
    fontFamily: 'var(--font-sans), system-ui, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'md',
  focusRing: 'auto',
  colors: {
    brand: [
      '#e6faf8',
      '#b3f0ea',
      '#80e6dc',
      '#4ddcce',
      '#1ad2c0',
      '#00b8a8',
      '#009688',
      '#007568',
      '#005248',
      '#003028',
    ],
  },
  other: {
    appName: 'HealthOS',
  },
})
