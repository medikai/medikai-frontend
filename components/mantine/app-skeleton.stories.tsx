import type { Meta, StoryObj } from '@storybook/react'
import { AppSkeleton } from './app-skeleton'

const meta: Meta<typeof AppSkeleton> = {
  title: 'Mantine/AppSkeleton',
  component: AppSkeleton,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AppSkeleton>

export const Lines: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-2">
      <AppSkeleton className="h-4 w-full" />
      <AppSkeleton className="h-4 w-4/5" />
      <AppSkeleton className="h-4 w-3/5" />
    </div>
  ),
}

export const Avatar: Story = {
  render: () => <AppSkeleton circle className="size-12" />,
}
