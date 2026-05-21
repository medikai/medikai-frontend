'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

const labelOverrides: Record<string, string> = {
  dashboard: 'Dashboard',
  patients: 'Patients',
  appointments: 'Appointments',
  vitals: 'Vitals',
  labs: 'Labs',
  messages: 'Messages',
  settings: 'Settings',
  help: 'Help',
}

function toLabel(segment: string) {
  if (labelOverrides[segment]) return labelOverrides[segment]
  return segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function DashboardBreadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 transition-colors hover:text-foreground"
      >
        <Home className="size-3.5" />
      </Link>
      {segments.map((seg, i) => {
        const href = '/' + segments.slice(0, i + 1).join('/')
        const isLast = i === segments.length - 1
        return (
          <React.Fragment key={href}>
            <ChevronRight className="size-3.5 text-muted-foreground/50" />
            {isLast ? (
              <span className="font-medium text-foreground">{toLabel(seg)}</span>
            ) : (
              <Link href={href} className="transition-colors hover:text-foreground">
                {toLabel(seg)}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
