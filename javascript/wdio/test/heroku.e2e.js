const { remote } = require('webdriverio')
const { expect } = require('chai')
const path = require('path')
require('dotenv').config({
  path: path.join(__dirname, '..', '..', '..', '.env')
})

const { wdioConfig, WdioManualController } = require('@axe-core/watcher')

const { AXE_SERVER_URL, AXE_WATCHER_API_KEY } = process.env

if (!AXE_WATCHER_API_KEY) {
  throw new Error('AXE_WATCHER_API_KEY is not defined')
}

describe('My Login Application', () => {
  let browser
  let manualController

  before(async () => {
    browser = await remote(
      wdioConfig({
        axe: {
          apiKey: AXE_WATCHER_API_KEY,
          serverURL: AXE_SERVER_URL
        }
      })
    )

    // initialize the axe Watcher manual controller
    manualController = new WdioManualController(browser)
  })

  after(async () => {
    await browser.deleteSession()
  })

  describe('Automatic Analysis', function () {
    it('should login with valid credentials', async () => {
      await browser.url('https://the-internet.herokuapp.com/login')

      await browser.$('#username').setValue('tomsmith')
      await browser.$('#password').setValue('SuperSecretPassword!')
      await browser.$('button[type="submit"]').click()
      await browser.$('#flash').waitForExist()

      // Assert that 'You logged into a secure area!' element exists
      expect(browser.$('#flash')).to.be.exist
    })
  })

  describe('Manual Mode', function () {
    it('should login with valid credentials', async () => {
      // Stop automatic axe analysis
      await manualController.stop()

      await browser.url('https://the-internet.herokuapp.com/login')

      await manualController.analyze()

      await browser.$('#username').setValue('tomsmith')
      await browser.$('#password').setValue('SuperSecretPassword!')
      await browser.$('button[type="submit"]').click()
      await browser.$('#flash').waitForExist()

      await manualController.analyze()

      // Restart automatic axe analysis
      await manualController.start()

      // Assert that 'You logged into a secure area!' element exists
      expect(browser.$('#flash')).to.be.exist
    })
  })
})
