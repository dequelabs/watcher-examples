import 'mocha'
import { Builder, By, WebDriver } from 'selenium-webdriver'
import { Driver } from 'selenium-webdriver/chrome'
import { webdriverConfig, WebdriverManualController } from '@deque/watcher'
import { v4 } from 'uuid'

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('My Login Application', () => {
  let driver: any

  const {
    AXE_SERVER_URL = 'http://localhost:3000',
    AXE_WATCHER_API_KEY = 'foobar'
  } = process.env

  if (!AXE_WATCHER_API_KEY) {
    throw new Error('AXE_WATCHER_API_KEY is not defined')
  }

  const AXE_WATCHER_SESSION_ID = v4()

  before(async () => {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(
        webdriverConfig({
          axe: {
            apiKey: AXE_WATCHER_API_KEY,
            sessionId: AXE_WATCHER_SESSION_ID,
            serverURL: AXE_SERVER_URL
          }
        })
      )
      .build()
  })

  after(async () => {
    await driver.quit()
  })

  it('should login with valid credentials', async () => {
    await driver.get('https://the-internet.herokuapp.com/login')
    await delay(500)

    await driver.findElement(By.css('#username')).sendKeys('tomsmith')
    await driver
      .findElement(By.css('#password'))
      .sendKeys('SuperSecretPassword!')
    await driver.findElement(By.css('button[type="submit"]')).click()
    await delay(500)
  })

  describe('Manual Mode', function () {
    it('should login with valid credentials', async () => {
      await driver.get('https://the-internet.herokuapp.com/login')
      const axeController = new WebdriverManualController(driver)
      await delay(500)

      // Stop automatic axe analysis
      await axeController.stop()
      await axeController.analyze()

      await driver.findElement(By.css('#username')).sendKeys('tomsmith')
      await driver
        .findElement(By.css('#password'))
        .sendKeys('SuperSecretPassword!')
      await driver.findElement(By.css('button[type="submit"]')).click()
      await delay(500)

      await axeController.stop()
      await axeController.analyze()

      // Restart automatic axe analysis
      await axeController.stop()
    })
  })
})
