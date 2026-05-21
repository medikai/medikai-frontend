'use client'

import { Loader, type LoaderProps } from '@mantine/core'

export type AppLoaderProps = LoaderProps

export function AppLoader(props: AppLoaderProps) {
  return <Loader type="oval" {...props} />
}
