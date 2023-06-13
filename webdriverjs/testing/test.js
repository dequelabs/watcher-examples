const { By, Key, until } = require('selenium-webdriver')
const { suite } = require('selenium-webdriver/testing')
const {
  wrapWebdriver,
  webdriverConfig,
  WebdriverController
} = require('@axe-core/watcher')

/* Get your configuration from environment variables. */
const { API_KEY, SERVER_URL = 'https://axe.deque.com' } = process.env

suite(env => {
  describe('Google Search', () => {
    let driver

    before(async () => {
      const builder = env.builder()

      // axe Watcher only supports Chrome.
      if (env.browser.name !== 'chrome') {
        driver = await env.builder().build()
      } else {
        driver = await builder
          .setChromeOptions(
            webdriverConfig({
              axe: {
                apiKey: API_KEY,
                serverURL: SERVER_URL
              }
            })
          )
          .build()

        const controller = new WebdriverController(driver)
        driver = wrapWebdriver(driver, controller)
      }
    })

    after(() => driver.quit())

    it('demo', async () => {
      await driver.get('http://www.google.com/ncr')

      let q = await driver.findElement(By.name('q'))
      await q.sendKeys('webdriver', Key.RETURN)
      await driver.wait(until.titleIs('webdriver - Google Search'), 1000)
    })
  })
})
