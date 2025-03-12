const { until } = require('selenium-webdriver')
const { suite } = require('selenium-webdriver/testing')
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

suite(env => {
  describe('My Login Application', () => {
    let browser
    let controller

    before(async () => {
      const options = new Options()
      options.addArguments('--headless=new')
      const builder = env.builder()

      // axe Watcher only supports Chrome.
      if (env.browser.name !== 'chrome') {
        browser = await env.builder().build()
      } else {
        browser = await builder
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
      }
    })

    after(async () => {
      await browser?.quit()
    })

    describe('with valid credentials', () => {
      it('should login', async () => {
        await browser.get('https://the-internet.herokuapp.com/login')

        const username = await browser.findElement({ id: 'username' })
        const password = await browser.findElement({ id: 'password' })

        await username.sendKeys('tomsmith')
        await password.sendKeys('SuperSecretPassword!')

        const submit = await browser.findElement({
          css: 'button[type="submit"]'
        })
        await submit.click()

        await browser.wait(until.urlContains('/secure'))
      })
    })
  })
})
