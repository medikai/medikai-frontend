import type { Metadata, Viewport } from 'next'
import { ColorSchemeScript } from '@mantine/core'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { Inter, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { AppProviders } from '@/providers/app-providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://healthos.app'),
  title: {
    default: 'HealthOS — The Operating System for Modern Healthcare',
    template: '%s · HealthOS',
  },
  description:
    'HealthOS MVP Phase 1 — facility & role registrations, appointments, reception flows, ABHA-aligned security. Doctors unlock clinic administration on Growth plans.',
  keywords: [
    'hospital management',
    'healthcare platform',
    'AI healthcare',
    'electronic health records',
    'EHR',
    'appointments',
    'medical records',
    'patient care',
    'HealthOS',
  ],
  authors: [{ name: 'HealthOS' }],
  openGraph: {
    title: 'HealthOS — The Operating System for Modern Healthcare',
    description:
      'Facility & patient onboarding, clinician workspace, appointments, ABHA-aligned security — MVP Phase 1.',
    type: 'website',
    siteName: 'HealthOS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HealthOS — The Operating System for Modern Healthcare',
    description:
      'Facility & patient onboarding, clinician workspace, appointments, ABHA-aligned security — MVP Phase 1.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafb' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} bg-background`}
    >
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <AppProviders>
          {children}
          <Toaster richColors position="top-right" />
        </AppProviders>
      </body>
    </html>
  )
}
