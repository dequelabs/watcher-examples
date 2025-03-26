import 'mocha'
import puppeteer, { type Page, type Browser } from 'puppeteer'
import {
  puppeteerConfig,
  PuppeteerController,
  wrapPuppeteerPage
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

let page: Page
let browser: Browser
let controller: PuppeteerController

before(async () => {
  browser = await puppeteer.launch(
    puppeteerConfig({
      axe: {
        ...(configurationOverrides && { configurationOverrides }),
        apiKey: API_KEY,
        serverURL: SERVER_URL
      },
      headless: false,
      args: ['--headless=new', '--no-sandbox', '--disable-setuid-sandbox']
    })
  )
})

beforeEach(async () => {
  // Create a page instance, using your browser instance.
  page = await browser.newPage()

  // Initialize the PuppeteerController by passing in the Puppeteer page.
  controller = new PuppeteerController(page)

  // Use the new wrapped Puppeteer page instance.
  page = wrapPuppeteerPage(page, controller)
})

afterEach(async () => {
  await controller.flush()
  await page.close()
})

after(async () => {
  await browser.close()
})

export { page, controller, browser }
