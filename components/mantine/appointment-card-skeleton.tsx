'use client'

import { AppSkeleton } from './app-skeleton'

/** Loading placeholder matching `AppointmentCard` layout. */
export function AppointmentCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card">
      <span className="absolute inset-y-0 left-0 w-1 bg-border" aria-hidden />
      <div className="flex">
        <div className="flex w-[112px] shrink-0 flex-col border-r border-border/60 p-5">
          <AppSkeleton className="h-3 w-12" />
          <AppSkeleton className="mt-2 h-8 w-16" />
          <AppSkeleton className="mt-2 h-3 w-14" />
        </div>
        <div className="flex-1 space-y-3 p-5">
          <div className="flex items-start gap-3">
            <AppSkeleton circle className="size-11 shrink-0" />
            <div className="flex flex-1 flex-col gap-2">
              <AppSkeleton className="h-4 w-40" />
              <AppSkeleton className="h-3 w-56 max-w-full" />
              <AppSkeleton className="h-3 w-32" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <AppSkeleton className="h-5 w-20 rounded-full" radius="xl" />
            <AppSkeleton className="h-5 w-20 rounded-full" radius="xl" />
            <AppSkeleton className="h-5 w-24 rounded-full" radius="xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
