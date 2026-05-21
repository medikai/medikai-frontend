'use client'

import { Skeleton, type SkeletonProps } from '@mantine/core'
import { cn } from '@/lib/utils'

export type AppSkeletonProps = SkeletonProps & {
  className?: string
}

/** Mantine-backed skeleton with Tailwind `className` support for layout sizing. */
export function AppSkeleton({
  className,
  radius = 'md',
  animate = true,
  ...props
}: AppSkeletonProps) {
  return <Skeleton className={cn(className)} radius={radius} animate={animate} {...props} />
}
