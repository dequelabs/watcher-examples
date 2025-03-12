import 'mocha'
import { wdioConfig, WdioController, wrapWdio } from '@axe-core/watcher'
import { remote } from 'webdriverio'

/* Get your configuration from environment variables. */
const { API_KEY, SERVER_URL = 'https://axe.deque.com' } = process.env

let browser: WebdriverIO.Browser
let controller: WdioController

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

before(async () => {
  browser = await remote(
    wdioConfig({
      axe: {
        ...(configurationOverrides && { configurationOverrides }),
        apiKey: API_KEY as string,
        serverURL: SERVER_URL,
        /* Disable automatic analysis */
        autoAnalyze: false
      },
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': { args: ['--headless=new'] }
      }
    })
  )

  controller = new WdioController(browser)
  wrapWdio(browser, controller)
})

afterEach(async () => {
  await controller.flush()
})

after(async () => {
  browser.deleteSession()
})

export { browser, controller }
