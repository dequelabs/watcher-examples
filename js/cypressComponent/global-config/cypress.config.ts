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
      serverURL: axeServerURL, // axe-core cloud server URL
      /**
       * configurationOverrides allows users to override the org-wide settings
       * configured in the axe account.
       *
       * Notes:
       *  1. If you do not wish to override a specific field, simply omit it from this object.
       *  2. If you lack permission to override a particular field, the configuration will not proceed.
       *  3. For more details on using global configurations, visit:
       *     https://docs.deque.com/developer-hub/2/en/dh-global-configuration
       *  4. For more information on the configurationOverrides object, see:
       *     https://docs.deque.com/developer-hub/2/en/dh-api-reference#configurationoverrides-interface
       */
      configurationOverrides: {
        accessibilityStandard: 'WCAG 2.2 AAA', // Defines the accessibility standard to apply during axe-core scans
        axeCoreVersion: '4.10.2', // Specifies the version of axe-core to use
        bestPractices: true, // Enables or disables axe-core best practice rules
        experimentalRules: true // Enables or disables experimental axe-core rules
      }
    },
    defaultCommandTimeout: 30000, // Set default command timeout to 30 seconds

    // Component testing configuration
    component: {
      devServer: {
        framework: 'next', // Use Next.js as the framework
        bundler: 'webpack' // Use webpack as the bundler
      },
      specPattern: '**/Button.cy.{ts,tsx}', // Pattern for component test files
      supportFile: 'cypress/support/component.ts' // Support file for component tests
    }
  })
})
