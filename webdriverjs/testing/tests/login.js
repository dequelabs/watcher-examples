const { until } = require('selenium-webdriver')
const { suite } = require('selenium-webdriver/testing')
const {
  wrapWebdriver,
  webdriverConfig,
  WebdriverController
} = require('@axe-core/watcher')

/* Get your configuration from environment variables. */
const { API_KEY, SERVER_URL = 'https://axe.deque.com' } = process.env

suite(env => {
  describe('My Login Application', () => {
    let browser
    let controller

    before(async () => {
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
              }
            })
          )
          .build()

        controller = new WebdriverController(browser)
        browser = wrapWebdriver(browser, controller)
      }
    })

    after(async () => {
      await browser.quit()
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
})
