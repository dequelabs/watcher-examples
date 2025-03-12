import { wdioTestRunner } from '@axe-core/watcher'
import assert from 'assert'

/* Get your configuration from environment variables. */
const { API_KEY, SERVER_URL = 'https://axe.deque.com' } = process.env
assert(
  API_KEY,
  'Ensure your axe Developer API key is set via the `AXE_API_KEY` environment variable.'
)

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
const experimental: boolean | undefined = undefined // Set to true or false

/**
 * Version of axe core to use
 * Example: '4.1.2'
 */
const axeCoreVersion: string | undefined = undefined // Set your value here

// Build configuration overrides object only if at least one setting is defined
const configurationOverrides =
  accessibilityStandard ||
  bestPractices !== undefined ||
  experimental !== undefined ||
  axeCoreVersion
    ? {
        ...(accessibilityStandard !== undefined && { accessibilityStandard }),
        ...(axeCoreVersion !== undefined && { axeCoreVersion }),
        ...(bestPractices !== undefined && { bestPractices }),
        ...(experimental !== undefined && { experimental })
      }
    : undefined

export const config = wdioTestRunner({
  axe: {
    ...(configurationOverrides && { configurationOverrides }),
    apiKey: API_KEY as string,
    serverURL: SERVER_URL
  },

  // Remaining WDIO configuration options
  runner: 'local',
  tsConfigPath: './tsconfig.json',
  specs: ['./features/**/*.feature'],
  exclude: [],
  maxInstances: 10,
  capabilities: [
    {
      browserName: 'chrome',
      'goog:chromeOptions': { args: ['--headless=new'] }
    }
  ],
  logLevel: 'debug',
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  framework: 'cucumber',
  reporters: ['spec'],
  cucumberOpts: {
    require: ['./features/step-definitions/steps.ts'],
    backtrace: false,
    requireModule: [],
    dryRun: false,
    failFast: false,
    name: [],
    snippets: true,
    source: true,
    strict: false,
    tagExpression: '',
    timeout: 60000,
    ignoreUndefinedDefinitions: false
  }
})
