'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Menu, Search, Plus, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { DashboardBreadcrumbs } from '@/components/dashboard/dashboard-breadcrumbs'
import { clearDemoSession } from '@/lib/demo-session'

export function DashboardTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter()

  const handleSignOut = () => {
    clearDemoSession()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>

        <div className="hidden min-w-0 flex-1 md:block">
          <DashboardBreadcrumbs />
        </div>

        <div className="relative hidden w-72 md:flex">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search patients, records, labs…"
            className="h-9 border-border/60 bg-card/60 pr-12 pl-9"
          />
          <kbd className="absolute top-1/2 right-2 -translate-y-1/2 rounded border border-border/60 bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </div>

        <Button size="sm" className="hidden sm:inline-flex">
          <Plus className="size-4" />
          New
        </Button>

        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="size-5" />
          <span className="absolute top-2 right-2 size-2 rounded-full bg-primary ring-2 ring-background" />
        </Button>

        <ThemeToggle />

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="hidden sm:inline-flex"
          onClick={handleSignOut}
        >
          <LogOut className="mr-1.5 size-3.5" />
          Sign out
        </Button>

        <button
          aria-label="Account"
          className="ml-1 inline-flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[oklch(0.55_0.18_270)] text-sm font-semibold text-white shadow-sm ring-2 ring-background transition-opacity hover:opacity-90"
        >
          DR
        </button>
      </div>
    </header>
  )
}
