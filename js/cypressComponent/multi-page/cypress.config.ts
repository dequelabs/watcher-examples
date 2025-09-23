import { defineConfig } from 'cypress'
import { cypressConfig } from '@axe-core/watcher'

// Read API key and server URL from environment variables for security and flexibility
const axeApiKey = process.env.AXE_API_KEY || ''
const axeServerURL = process.env.AXE_SERVER_URL || 'https://axe.deque.com/'

export default defineConfig({
  // Merge in the axe-core watcher Cypress config
  ...cypressConfig({
    axe: {
      apiKey: axeApiKey, // API key for axe-core cloud integration
      testingTypes: ['component', 'e2e'], // Enable both component and e2e testing
      serverURL: axeServerURL // axe-core cloud server URL
    },
    defaultCommandTimeout: 30000, // Set default command timeout to 30 seconds

    // Component testing configuration
    component: {
      devServer: {
        framework: 'next', // Use Next.js as the framework
        bundler: 'webpack' // Use webpack as the bundler
      },
      specPattern: '**/*.cy.{ts,tsx}', // Pattern for component test files
      supportFile: 'cypress/support/component.ts' // Support file for component tests
    }
  })
})
