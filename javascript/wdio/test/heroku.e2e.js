const { remote } = require('webdriverio')
const { expect } = require('chai')

const { wdioConfig, WdioManualController } = require('@deque/watcher')

const { AXE_SERVER_URL, AXE_WATCHER_API_KEY } = process.env

if (!AXE_WATCHER_API_KEY) {
  throw new Error('AXE_WATCHER_API_KEY is not defined')
}

describe('My Login Application', () => {
  let browser

  before(async () => {
    browser = await remote(
      wdioConfig({
        axe: {
          apiKey: AXE_WATCHER_API_KEY,
          serverURL: AXE_SERVER_URL
        }
      })
    )
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
      await browser.url('https://the-internet.herokuapp.com/login')
      const axeController = new WdioManualController(browser)

      // Stop automatic axe analysis
      await axeController.stop()
      await axeController.analyze()

      await browser.$('#username').setValue('tomsmith')
      await browser.$('#password').setValue('SuperSecretPassword!')
      await browser.$('button[type="submit"]').click()
      await browser.$('#flash').waitForExist()

      await axeController.analyze()

      // Restart automatic axe analysis
      await axeController.start()

      // Assert that 'You logged into a secure area!' element exists
      expect(browser.$('#flash')).to.be.exist
    })
  })
})
