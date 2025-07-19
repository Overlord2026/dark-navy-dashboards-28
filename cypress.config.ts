import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: process.env.E2E_URL || 'https://00a95494-1379-485c-9fca-9a2135238b56.lovableproject.com',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
})