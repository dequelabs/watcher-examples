const { assert } = require('chai')
const puppeteer = require('puppeteer')
const {
  wrapPuppeteerPage,
  PuppeteerController,
  puppeteerConfig
} = require('@axe-core/watcher')

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

describe('My Login Application', () => {
  let browser
  let page
  let controller

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
    // Create a page instance, using your browser instance.
    page = await browser.newPage()

    // Initialize the PuppeteerController by passing in the Puppeteer page.
    controller = new PuppeteerController(page)

    // Use the new wrapped Puppeteer page instance.
    page = wrapPuppeteerPage(page, controller)
  })

  after(async () => {
    await browser.close()
  })

  afterEach(async () => {
    /* Flush axe-watcher results after each test. */
    await controller.flush()
    await page.close()
  })

  describe('Login', () => {
    describe('with valid credentials', () => {
      it('should login', async () => {
        await page.goto('https://the-internet.herokuapp.com/login')

        await page.type('#username', 'tomsmith')
        await page.type('#password', 'SuperSecretPassword!')

        await page.click('button[type="submit"]')

        const element = await page.waitForSelector('#flash')
        assert.isNotNull(element)
      })
    })
  })
})
