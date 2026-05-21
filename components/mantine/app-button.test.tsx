import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test-utils/render'
import { AppButton } from './app-button'

describe('AppButton', () => {
  it('renders label and handles click', async () => {
    const user = userEvent.setup()
    const onClick = jest.fn()

    renderWithProviders(<AppButton onClick={onClick}>Continue</AppButton>)

    const button = screen.getByRole('button', { name: /continue/i })
    await user.click(button)

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    renderWithProviders(<AppButton isLoading>Save</AppButton>)
    expect(screen.getByRole('button')).toHaveAttribute('data-loading', 'true')
  })
})
