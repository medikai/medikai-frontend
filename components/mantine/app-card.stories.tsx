import type { Meta, StoryObj } from '@storybook/react'
import { AppText, AppTitle } from './app-text'
import { AppCard } from './app-card'

const meta: Meta<typeof AppCard> = {
  title: 'Mantine/AppCard',
  component: AppCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AppCard>

export const Default: Story = {
  render: () => (
    <AppCard maw={360}>
      <AppTitle order={4}>Patient vitals</AppTitle>
      <AppText c="dimmed" size="sm" mt="xs">
        Track blood pressure, heart rate, and SpO₂ in one workspace.
      </AppText>
    </AppCard>
  ),
}
