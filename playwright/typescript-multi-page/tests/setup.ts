import 'mocha'
import playwright from 'playwright'
import {
  playwrightConfig,
  PlaywrightController,
  wrapPlaywrightPage
} from '@axe-core/watcher'
import assert from 'assert'

const { API_KEY, SERVER_URL = 'https://axe.deque.com' } = process.env
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

let page: playwright.Page
let browserContext: playwright.BrowserContext
let controller: PlaywrightController

before(async () => {
  browserContext = await playwright.chromium.launchPersistentContext(
    '',
    playwrightConfig({
      axe: {
        ...(configurationOverrides && { configurationOverrides }),
        apiKey: API_KEY,
        serverURL: SERVER_URL
      },
      headless: false,
      args: ['--headless=new']
    })
  )
})

beforeEach(async () => {
  // Create a page instance, using your browser context.
  page = await browserContext.newPage()

  // Initialize the PlaywrightController by passing in the Playwright page.
  controller = new PlaywrightController(page)

  // Use the new wrapped Playwright page instance.
  page = wrapPlaywrightPage(page, controller)
})

afterEach(async () => {
  await controller.flush()
})

after(async () => {
  await browserContext.close()
})

export { page, controller, browserContext }
