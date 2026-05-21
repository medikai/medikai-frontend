'use client'

import { Button, type ButtonProps } from '@mantine/core'
import type { ComponentPropsWithoutRef } from 'react'

export type AppButtonProps = ButtonProps &
  ComponentPropsWithoutRef<'button'> & {
    isLoading?: boolean
  }

export function AppButton({ isLoading, loading, ...props }: AppButtonProps) {
  return <Button loading={isLoading ?? loading} {...props} />
}
