const { Builder, until } = require('selenium-webdriver')
const {
  wrapWebdriver,
  webdriverConfig,
  WebdriverController
} = require('@axe-core/watcher')
const { Options } = require('selenium-webdriver/chrome')

/* Get your configuration from environment variables. */
const { API_KEY, SERVER_URL = 'https://axe.deque.com' } = process.env

describe('My Login Application', () => {
  let browser
  let controller

  before(async () => {
    browser = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(
        webdriverConfig(
          {
            axe: {
              apiKey: API_KEY,
              serverURL: SERVER_URL
            }
          },
          ...new Options().addArguments('--headless=new')
        )
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
