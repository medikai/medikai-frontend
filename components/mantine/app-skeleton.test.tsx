import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils/render'
import { AppSkeleton } from './app-skeleton'

describe('AppSkeleton', () => {
  it('renders with data-slot for shadcn compatibility', () => {
    renderWithProviders(<AppSkeleton className="h-4 w-24" data-slot="skeleton" />)
    expect(document.querySelector('[data-slot="skeleton"]')).toBeInTheDocument()
  })

  it('renders circle variant', () => {
    const { container } = renderWithProviders(<AppSkeleton circle className="size-10" />)
    expect(container.querySelector('.mantine-Skeleton-root')).toBeInTheDocument()
  })
})
