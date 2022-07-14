import 'mocha'
import playwright from 'playwright'
import { expect } from '@playwright/test'
import { playwrightConfig, PlaywrightManualController } from '@deque/watcher'
import { v4 } from 'uuid'

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('My Login Application', () => {
  let page: playwright.Page
  let browser: playwright.BrowserContext

  const {
    AXE_SERVER_URL = 'http://localhost:3000',
    AXE_WATCHER_API_KEY = 'foobar'
  } = process.env

  if (!AXE_WATCHER_API_KEY) {
    throw new Error('AXE_WATCHER_API_KEY is not defined')
  }

  const AXE_WATCHER_SESSION_ID = v4()
  before(async () => {
    browser = await playwright.chromium.launchPersistentContext(
      /**
       * pass an empty string so all of the browser session data, local storage saves to temp directory
       * rather than project directory
       *  */
      '',
      playwrightConfig({
        axe: {
          apiKey: AXE_WATCHER_API_KEY,
          sessionId: AXE_WATCHER_SESSION_ID,
          serverURL: AXE_SERVER_URL
        }
      })
    )

    page = await browser.newPage()
  })

  after(async () => {
    await browser.close()
  })

  it('should login with valid credentials', async () => {
    await page.goto('https://the-internet.herokuapp.com/login')
    await delay(500);

    await page.locator('#username').type('tomsmith')
    await page.locator('#password').type('SuperSecretPassword!')
    await page.locator('button[type="submit"]').click()
    await delay(500);

    await expect(page.locator('#flash')).toBeTruthy()
    await expect(page.locator('#flash')).toContainText(
      'You logged into a secure area!'
    )
  })

  describe('Manual Mode', function () {
    it('should login with valid credentials', async () => {
      await page.goto('https://the-internet.herokuapp.com/login')
      const axeController = new PlaywrightManualController(page)

      // Stop automatic axe analysis
      await axeController.stop()
      await axeController.analyze()
      await delay(500);

      await page.locator('#username').type('tomsmith')
      await page.locator('#password').type('SuperSecretPassword!')
      await page.locator('button[type="submit"]').click()
      await delay(500);
      
      await axeController.stop()
      await axeController.analyze()

      // Restart automatic axe analysis
      await axeController.stop()
    })
  })
})
