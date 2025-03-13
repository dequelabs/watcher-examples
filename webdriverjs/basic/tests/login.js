const { Builder, until } = require('selenium-webdriver')
const {
  wrapWebdriver,
  webdriverConfig,
  WebdriverController
} = require('@axe-core/watcher')
const { Options } = require('selenium-webdriver/chrome')

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
  let browser
  let controller

  before(async () => {
    const options = new Options()
    options.addArguments('--headless=new')
    browser = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(
        webdriverConfig({
          axe: {
            ...(configurationOverrides && { configurationOverrides }),
            apiKey: API_KEY,
            serverURL: SERVER_URL
          },
          options
        })
      )
      .build()
    controller = new WebdriverController(browser)
    browser = wrapWebdriver(browser, controller)
  })

  after(async () => {
    await browser.quit()
  })

  afterEach(async () => {
    await controller.flush()
  })

  describe('with valid credentials', () => {
    it('should login', async () => {
      await browser.get('https://the-internet.herokuapp.com/login')

      const username = await browser.findElement({ id: 'username' })
      const password = await browser.findElement({ id: 'password' })

      await username.sendKeys('tomsmith')
      await password.sendKeys('SuperSecretPassword!')

      const submit = await browser.findElement({ css: 'button[type="submit"]' })
      await submit.click()

      await browser.wait(until.urlContains('/secure'))
    })
  })
})
