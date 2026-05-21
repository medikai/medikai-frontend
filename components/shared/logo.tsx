'use client'

import Link from 'next/link'
import { Anchor, Avatar, Group, Text } from '@mantine/core'
import { cn } from '@/lib/utils'

/** Source file for the mark crop (`public/HealthOs.png`). Replace with `logo.svg` via `markSrc` when ready. */
export const DEFAULT_LOGO_MARK_SRC = '/HealthOs.png' as const

type LogoProps = {
  href?: string
  className?: string
  /** Image cropped inside the round mark (icon area of your asset). */
  markSrc?: string
  /** Icon-only circle, no “HealthOS” text. */
  showWordmark?: boolean
  size?: 'sm' | 'md' | 'lg'
  /** On dark panels (auth sidebar) — light ring + brighter glow. */
  onDark?: boolean
  priority?: boolean
}

const avatarPx = {
  sm: 32,
  md: 36,
  lg: 44,
} as const

const textSize = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const

const crop = {
  sm: { objectPosition: '50% 22%', transform: 'scale(2.15)' },
  md: { objectPosition: '50% 24%', transform: 'scale(2.1)' },
  lg: { objectPosition: '50% 26%', transform: 'scale(2.05)' },
} as const

function LogoMark({
  markSrc,
  size,
  onDark,
  priority,
}: {
  markSrc: string
  size: keyof typeof avatarPx
  onDark?: boolean
  priority?: boolean
}) {
  const px = avatarPx[size]
  const isSvg = markSrc.endsWith('.svg')

  const sharedStyles = {
    root: {
      flexShrink: 0,
      border: onDark
        ? '2px solid rgba(255,255,255,0.28)'
        : '2px solid color-mix(in oklch, var(--mantine-color-teal-filled) 35%, transparent)',
      boxShadow: onDark
        ? '0 0 28px -6px color-mix(in oklch, var(--mantine-color-teal-4) 55%, transparent)'
        : '0 8px 28px -10px color-mix(in oklch, var(--mantine-color-teal-filled) 50%, transparent)',
      background: onDark
        ? 'color-mix(in oklch, white 12%, transparent)'
        : 'linear-gradient(145deg, color-mix(in oklch, var(--mantine-color-teal-filled) 22%, transparent), color-mix(in oklch, var(--mantine-color-teal-filled) 8%, transparent))',
    },
    image: {
      objectFit: 'cover' as const,
      ...crop[size],
    },
  }

  if (isSvg) {
    return (
      <Avatar radius={999} size={px} styles={sharedStyles}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={markSrc}
          alt=""
          width={Math.round(px * 0.88)}
          height={Math.round(px * 0.88)}
          loading={priority ? 'eager' : 'lazy'}
          draggable={false}
          style={{ objectFit: 'contain' }}
        />
      </Avatar>
    )
  }

  return (
    <Avatar
      src={markSrc}
      alt=""
      radius={999}
      size={px}
      styles={sharedStyles}
      imageProps={{
        loading: priority ? 'eager' : 'lazy',
        draggable: false,
      }}
    />
  )
}

function LogoWordmark({
  size,
  onDark,
}: {
  size: keyof typeof textSize
  onDark?: boolean
}) {
  const sz = textSize[size]
  return (
    <Text
      component="span"
      fw={600}
      size={sz}
      lh={1.15}
      className="logo-wordmark tracking-tight"
      c={onDark ? 'white' : undefined}
    >
      Health
      <Text
        component="span"
        span
        fz="inherit"
        fw={600}
        inherit
        c={onDark ? 'teal.2' : 'teal'}
      >
        OS
      </Text>
    </Text>
  )
}

export function Logo({
  href = '/',
  className,
  markSrc = DEFAULT_LOGO_MARK_SRC,
  showWordmark = true,
  size = 'md',
  onDark = false,
  priority = false,
}: LogoProps) {
  const content = (
    <>
      <LogoMark markSrc={markSrc} size={size} onDark={onDark} priority={priority} />
      {showWordmark ? <LogoWordmark size={size} onDark={onDark} /> : null}
    </>
  )

  if (!href) {
    return (
      <Group gap="sm" wrap="nowrap" className={className}>
        {content}
      </Group>
    )
  }

  return (
    <Anchor
      component={Link}
      href={href}
      underline="never"
      aria-label="HealthOS home"
      className={cn(
        'inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
    >
      <Group gap="sm" wrap="nowrap">
        {content}
      </Group>
    </Anchor>
  )
}
