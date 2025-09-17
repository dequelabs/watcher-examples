const { until } = require('selenium-webdriver')
const { suite } = require('selenium-webdriver/testing')
const {
  wrapWebdriver,
  webdriverConfig,
  WebdriverController
} = require('@axe-core/watcher')
const { Options } = require('selenium-webdriver/chrome')
const {
  getChromeBinaryPath
} = require('../../../utils/setup-chrome-chromedriver.js')

/* Get your configuration from environment variables. */
const { API_KEY, SERVER_URL = 'https://axe.deque.com' } = process.env

suite(env => {
  describe('My Login Application', () => {
    let browser
    let controller

    before(async () => {
      const options = new Options()
      options.addArguments('--headless=new')
      /*
       * You can use the utility to get the Chrome binary path, including installing Chrome, if needed.
       * This can be overridden by setting CHROME_BIN in the environment variables.
       * If you do not specify a binary, the default Chrome installation will be used.
       * This may cause issues, as Watcher does not support branded Chrome >= 139.
       */
      options.setBinaryPath(getChromeBinaryPath())
      const builder = env.builder()

      // axe Watcher only supports Chrome.
      if (env.browser.name !== 'chrome') {
        browser = await env.builder().build()
      } else {
        browser = await builder
          .setChromeOptions(
            webdriverConfig({
              axe: {
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
