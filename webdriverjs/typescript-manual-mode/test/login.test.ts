import 'mocha'
import { Builder, By, until, WebDriver } from 'selenium-webdriver'
import { webdriverConfig, WebdriverController } from '@axe-core/watcher'

// Get your configuration from environment variables.
const { API_KEY, SERVER_URL } = process.env

describe('My Login Application', () => {
  let browser: WebDriver
  let controller: WebdriverController

  before(async () => {
    browser = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(
        webdriverConfig({
          axe: {
            apiKey: API_KEY as string,
            serverURL: SERVER_URL
          }
        })
      )
      .build()

    // Initialize the axe Watcher controller
    controller = new WebdriverController(browser)

    // Prevent automatic analysis.
    await controller.stop()
  })

  afterEach(async () => {
    // Ensure that all the axe Watcher test results are flushed out
    await controller.flush()
  })

  after(async () => {
    await browser.quit()
  })

  it('should login with valid credentials', async () => {
    await browser.get('https://the-internet.herokuapp.com/login')
    // Manually analyze the page in its initial state.
    await controller.analyze()
    await browser.findElement(By.id('username')).sendKeys('tomsmith')
    await browser
      .findElement(By.id('password'))
      .sendKeys('SuperSecretPassword!')
    await browser.findElement(By.css('button[type="submit"]')).click()
    // The page state has changed, so manually analyze the page again.
    await controller.analyze()
    await browser.wait(until.elementLocated(By.css('#flash')))
    // Analyze the page again, at the end state.
    await controller.analyze()
  })
})
