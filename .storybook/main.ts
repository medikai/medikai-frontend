import { defineMain } from '@storybook/nextjs/node'

export default defineMain({
  stories: ['../components/**/*.mdx', '../components/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['../public'],
})
