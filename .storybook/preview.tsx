import React from 'react'
import type { Preview } from '@storybook/react'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '../app/globals.css'
import { MantineAppProvider } from '../providers/mantine-app-provider'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <MantineAppProvider defaultColorScheme="light">
        <Story />
      </MantineAppProvider>
    ),
  ],
}

export default preview
