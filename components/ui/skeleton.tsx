'use client'

import { AppSkeleton } from '@/components/mantine/app-skeleton'

/** Shadcn-compatible export — renders Mantine `Skeleton` under the hood. */
function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return <AppSkeleton data-slot="skeleton" className={className} {...props} />
}

export { Skeleton }
