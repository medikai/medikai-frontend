import { render, type RenderOptions } from '@testing-library/react'
import { MantineAppProvider } from '@/providers/mantine-app-provider'

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <MantineAppProvider defaultColorScheme="light">{children}</MantineAppProvider>
    ),
    ...options,
  })
}
