import { cn } from '@/lib/utils'
import * as React from 'react'

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  as?: React.ElementType
  spacing?: 'sm' | 'md' | 'lg'
}

const spacingMap: Record<NonNullable<SectionProps['spacing']>, string> = {
  sm: 'py-12 md:py-16',
  md: 'py-16 md:py-24',
  lg: 'py-24 md:py-32',
}

export function Section({
  as: Tag = 'section',
  spacing = 'md',
  className,
  ...props
}: SectionProps) {
  return <Tag className={cn('relative w-full', spacingMap[spacing], className)} {...props} />
}

type EyebrowProps = React.HTMLAttributes<HTMLSpanElement> & {
  icon?: React.ReactNode
}

export function Eyebrow({ icon, className, children, ...props }: EyebrowProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase',
        className,
      )}
      {...props}
    >
      {icon ? <span className="text-primary">{icon}</span> : null}
      <span>{children}</span>
    </span>
  )
}

type SectionHeadingProps = {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex max-w-3xl flex-col gap-4',
        align === 'center' ? 'mx-auto items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow}
      <h2 className="text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="text-base leading-relaxed text-pretty text-muted-foreground md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  )
}
