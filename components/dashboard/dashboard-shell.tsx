'use client'

import * as React from 'react'
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
import { DashboardTopbar } from '@/components/dashboard/dashboard-topbar'
import { PageTransition } from '@/components/shared/page-transition'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <p
            role="status"
            className="mb-4 rounded-lg border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100"
          >
            <strong className="font-medium">Demo mode.</strong> This app has no backend in Next.js —
            auth and clinical data are simulated. Wire your own API before production use.
          </p>
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  )
}
