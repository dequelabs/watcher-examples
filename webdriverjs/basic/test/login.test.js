const { Builder, By, until } = require('selenium-webdriver')
const {
  webdriverConfig,
  WebdriverController
} = require('@axe-core/watcher')

describe('My Login Application', () => {
  let browser

  before(async () => {
    browser = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(
        webdriverConfig({
          axe: {
            apiKey: '11dc1214-cd42-4882-b568-bfc7dc384c18', // 'YOUR_API_KEY'
            serverURL: 'http://localhost:3000' // 'YOUR_SERVER_URL'
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
