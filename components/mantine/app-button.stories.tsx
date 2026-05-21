import type { Meta, StoryObj } from '@storybook/react'
import { AppButton } from './app-button'

const meta: Meta<typeof AppButton> = {
  title: 'Mantine/AppButton',
  component: AppButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'light', 'outline', 'subtle', 'default'],
    },
  },
}

export default meta
type Story = StoryObj<typeof AppButton>

export const Primary: Story = {
  args: {
    children: 'Book appointment',
    variant: 'filled',
  },
}

export const Loading: Story = {
  args: {
    children: 'Saving…',
    isLoading: true,
  },
}
