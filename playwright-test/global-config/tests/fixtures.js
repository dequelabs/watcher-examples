const { playwrightTest } = require('@axe-core/watcher')
const assert = require('assert')

const { SERVER_URL = 'https://axe.deque.com', API_KEY } = process.env
assert(API_KEY, 'API_KEY is required')

module.exports = playwrightTest({
  axe: {
    apiKey: API_KEY,
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
     *     https://docs.deque.com/developer-hub/2/en/dh-global-configuration
     */
    configurationOverrides: {
      accessibilityStandard: 'WCAG 2.2 AAA', // Defines the accessibility standard to apply during axe-core scans
      axeCoreVersion: '4.10.2', // Specifies the version of axe-core to use
      bestPractices: true, // Enables or disables axe-core best practice rules
      experimentalRules: true // Enables or disables experimental axe-core rules
    }
  },
  headless: false,
  args: ['--headless=new']
})
