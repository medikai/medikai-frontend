'use client'

import { Card, type CardProps } from '@mantine/core'

export type AppCardProps = CardProps

export function AppCard({ padding = 'lg', radius = 'md', withBorder, ...props }: AppCardProps) {
  return <Card padding={padding} radius={radius} withBorder={withBorder ?? true} {...props} />
}
