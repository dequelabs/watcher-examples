import { wdioTestRunner } from '@axe-core/watcher'

/* Get your configuration from environment variables. */
const { API_KEY, SERVER_URL = 'https://axe.deque.com' } = process.env

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
 */
const accessibilityStandard: string | undefined = undefined // Set your value here

/**
 * Enable axe core best practices rules
 */
const bestPractices: boolean | undefined = undefined // Set to true or false

/**
 * Enable experimental axe core rules
 */
const experimentalRules: boolean | undefined = undefined // Set to true or false

/**
 * Version of axe core to use
 * Example: '4.1.2'
 */
const axeCoreVersion: string | undefined = undefined // Set your value here

// Build configuration overrides object only if at least one setting is defined
const configurationOverrides =
  accessibilityStandard !== undefined ||
  bestPractices !== undefined ||
  experimentalRules !== undefined ||
  axeCoreVersion !== undefined
    ? {
      accessibilityStandard,
      axeCoreVersion,
      bestPractices,
      experimentalRules
    }
    : undefined

export const config = wdioTestRunner({
  axe: {
    ...(configurationOverrides && { configurationOverrides }),
    apiKey: API_KEY as string,
    serverURL: SERVER_URL
  },
  specs: ['forgot-password.test.ts', 'login.test.ts', 'home.test.ts'],
  capabilities: [
    {
      browserName: 'chrome',
      'goog:chromeOptions': { args: ['--headless=new'] }
    }
  ],
  baseUrl: 'https://the-internet.herokuapp.com',
  services: ['chromedriver'],
  framework: 'mocha',
  reporters: ['spec'],
  maxInstances: 5,
  mochaOpts: {
    timeout: 10000
  }
})
