const { playwrightTest } = require('@axe-core/watcher')
const assert = require('assert')

const { SERVER_URL = 'https://axe.deque.com', API_KEY } = process.env
assert(API_KEY, 'API_KEY is required')

/**
 * Configuration Overrides Section
 *
 * Set values for any of the 4 fields described below.
 * Ensure that the global configuration for your account allows changing these values.
 * If no values are set, configurationOverrides will be undefined and defaults will be used.
 *
 * DEVELOPERS: Set your desired values directly here 👇
 */

/**
 * Accessibility standard to use when axe core runs
 * Example: 'WCAG 2.1 AA'
 * @type {string|undefined}
 */
const accessibilityStandard = undefined // Set your value here

/**
 * Enable axe core best practices rules
 * @type {boolean|undefined}
 */
const bestPractices = undefined // Set to true or false

/**
 * Enable experimental axe core rules
 * @type {boolean|undefined}
 */
const experimental = undefined // Set to true or false

/**
 * Version of axe core to use
 * Example: '4.1.2'
 * @type {string|undefined}
 */
const axeCoreVersion = undefined // Set your value here

// Build configuration overrides object only if at least one setting is defined
const configurationOverrides =
  accessibilityStandard ||
  bestPractices !== undefined ||
  experimental !== undefined ||
  axeCoreVersion
    ? {
        ...(accessibilityStandard && { accessibilityStandard }),
        ...(axeCoreVersion && { axeCoreVersion }),
        ...(bestPractices !== undefined && { bestPractices }),
        ...(experimental !== undefined && { experimental })
      }
    : undefined

module.exports = playwrightTest({
  axe: {
    ...(configurationOverrides && { configurationOverrides }),
    apiKey: API_KEY,
    serverURL: SERVER_URL
  },
  headless: false,
  args: ['--headless=new']
})
