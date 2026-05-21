import { cn } from '@/lib/utils'
import * as React from 'react'

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: React.ElementType
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const sizeMap: Record<NonNullable<ContainerProps['size']>, string> = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-none',
}

export function Container({ as: Tag = 'div', size = 'xl', className, ...props }: ContainerProps) {
  return (
    <Tag
      className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', sizeMap[size], className)}
      {...props}
    />
  )
}
