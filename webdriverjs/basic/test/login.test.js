const { Builder, By, until } = require('selenium-webdriver')
const { webdriverConfig, WebdriverController } = require('@axe-core/watcher')

// Get your configuration from environment variables.
const { API_KEY, SERVER_URL } = process.env

describe('My Login Application', () => {
  let browser

  before(async () => {
    browser = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(
        webdriverConfig({
          axe: {
            apiKey: API_KEY,
            serverURL: SERVER_URL
          }
        })
      )
      .build()
  })

  afterEach(async () => {
    // Initialize the axe Watcher controller
    const controller = new WebdriverController(browser)
    // Ensure that all the axe Watcher test results are flushed out
    await controller.flush()
  })

  after(async () => {
    await browser.quit()
  })

  it('should login with valid credentials', async () => {
    await browser.get('https://the-internet.herokuapp.com/login')
    await browser.findElement(By.id('username')).sendKeys('tomsmith')
    await browser
      .findElement(By.id('password'))
      .sendKeys('SuperSecretPassword!')
    await browser.findElement(By.css('button[type="submit"]')).click()
    await browser.wait(until.elementLocated(By.css('#flash')))
  })
})
