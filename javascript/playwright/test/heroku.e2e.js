const { chromium } = require('playwright')
const { expect } = require('@playwright/test')
const { playwrightConfig, PlaywrightController } = require('@axe-core/watcher')
const path = require('path')
require('dotenv').config({
  path: path.join(__dirname, '..', '..', '..', '.env')
})

const { AXE_SERVER_URL, AXE_WATCHER_API_KEY } = process.env

describe('My Login Application', () => {
  let page
  let browser
  let controller

  before(async () => {
    browser = await chromium.launchPersistentContext(
      /**
       * pass an empty string so all of the browser session data, local storage saves to temp directory
       * rather than project directory
       *  */
      '',
      playwrightConfig({
        axe: {
          apiKey: AXE_WATCHER_API_KEY,
          serverURL: AXE_SERVER_URL
        }
      })
    )

    page = await browser.newPage()

    // initialize the axe Watcher controller
    controller = new PlaywrightController(page)
  })

  afterEach(async () => {
    // ensure that all the axe Watcher test results are flushed out
    await controller.flush()
  })

  after(async () => {
    await browser.close()
  })

  describe('Automatic Analysis', function () {
    it('should login with valid credentials', async () => {
      await page.goto('https://the-internet.herokuapp.com/login')

      await page.locator('#username').type('tomsmith')
      await page.locator('#password').type('SuperSecretPassword!')
      await page.locator('button[type="submit"]').click()
      await page.locator('#flash').waitFor()

      // Assert 'You logged into a secure area!' exists and contains correct text
      expect(page.locator('#flash')).toBeTruthy()
      await expect(page.locator('#flash')).toContainText(
        'You logged into a secure area!'
      )
    })
  })

  describe('Manual Mode', function () {
    it('should login with valid credentials', async () => {
      // Stop automatic axe analysis
      await controller.stop()

      await page.goto('https://the-internet.herokuapp.com/login')

      await controller.analyze()

      await page.locator('#username').type('tomsmith')
      await page.locator('#password').type('SuperSecretPassword!')
      await page.locator('button[type="submit"]').click()
      await page.locator('#flash').waitFor()

      await controller.analyze()

      // Restart automatic axe analysis
      await controller.start()

      // Assert 'You logged into a secure area!' exists and contains correct text
      expect(page.locator('#flash')).toBeTruthy()
      await expect(page.locator('#flash')).toContainText(
        'You logged into a secure area!'
      )
    })
  })
})
