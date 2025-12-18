const { defineConfig } = require('cypress')
const { cypressConfig } = require('@axe-core/watcher/cypress/config')

// Get your configuration from environment variables.
const {
  API_KEY,
  PROJECT_ID,
  SERVER_URL = 'https://axe.deque.com'
} = process.env

module.exports = defineConfig(
  cypressConfig({
    axe: {
      apiKey: API_KEY,
      projectId: PROJECT_ID,
      serverURL: SERVER_URL,
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
    defaultCommandTimeout: 10000
  })
)
