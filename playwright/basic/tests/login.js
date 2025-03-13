const { assert } = require('chai')
const playwright = require('playwright')
const {
  wrapPlaywrightPage,
  PlaywrightController,
  playwrightConfig
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
const experimentalRules = undefined // Set to true or false

/**
 * Version of axe core to use
 * Example: '4.1.2'
 * @type {string|undefined}
 */
const axeCoreVersion = undefined // Set your value here

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

describe('My Login Application', () => {
  let browserContext
  let page
  let controller

  before(async () => {
    browserContext = await playwright.chromium.launchPersistentContext(
      '',
      playwrightConfig({
        axe: {
          ...(configurationOverrides && { configurationOverrides }),
          apiKey: API_KEY,
          serverURL: SERVER_URL
        },
        //@see: https://playwright.dev/docs/chrome-extensions#headless-mode
        headless: false,
        args: ['--headless=new']
      })
    )

    // Create a page instance, using your browser context.
    page = await browserContext.newPage()

    // Initialize the PlaywrightController by passing in the Playwright page.
    controller = new PlaywrightController(page)

    // Use the new wrapped Playwright page instance.
    page = wrapPlaywrightPage(page, controller)
  })

  after(async () => {
    await browserContext.close()
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

        await page.locator('#username').fill('tomsmith')
        await page.locator('#password').fill('SuperSecretPassword!')

        await page.locator('button[type="submit"]').click()

        const element = await page.waitForSelector('#flash')

        assert.isNotNull(element)
      })
    })
  })
})
