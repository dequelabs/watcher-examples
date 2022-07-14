import 'mocha'
import { Builder, WebDriver, By } from 'selenium-webdriver'
import { webdriverConfig } from '@deque/watcher'
import { v4 } from 'uuid'

describe('My Login Application', () => {
  let driver: WebDriver

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
    ).build()
  })

  after(async () => {
    // await driver.quit()
  })

  it('should login with valid credentials', async () => {
    await driver.get('https://the-internet.herokuapp.com/login')
    await driver.findElement(By.css("#username")).sendKeys("tomsmith")
    await driver.findElement(By.css("#password")).sendKeys("SuperSecretPassword!")

    await driver.findElement(By.css('button[type="submit"]')).click()
  })
})