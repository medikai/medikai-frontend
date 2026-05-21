'use client'

import { Text, Title, type TextProps, type TitleProps } from '@mantine/core'
import type { PropsWithChildren } from 'react'

export type AppTextProps = PropsWithChildren<TextProps>
export type AppTitleProps = PropsWithChildren<TitleProps>

export function AppText({ children, ...props }: AppTextProps) {
  return <Text {...props}>{children}</Text>
}

export function AppTitle({ order = 2, children, ...props }: AppTitleProps) {
  return (
    <Title order={order} {...props}>
      {children}
    </Title>
  )
}
