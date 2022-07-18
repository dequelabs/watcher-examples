const Puppeteer = require('puppeteer')
const { expect } = require('chai')

const { puppeteerConfig, PuppeteerManualController } = require('@deque/watcher')

const { AXE_SERVER_URL, AXE_WATCHER_API_KEY } = process.env

if (!AXE_WATCHER_API_KEY) {
  throw new Error('AXE_WATCHER_API_KEY is not defined')
}

describe('My Login Application', () => {
  let browser
  let page

  before(async () => {
    browser = await Puppeteer.launch(
      puppeteerConfig({
        axe: {
          apiKey: AXE_WATCHER_API_KEY,
          serverURL: AXE_SERVER_URL
        }
      })
    )

    page = await browser.newPage()
  })

  after(async () => {
    await browser.close()
  })

  describe('Automatic Analysis', function () {
    it('should login with valid credentials', async () => {
      await page.goto('https://the-internet.herokuapp.com/login')

      await page.type('#username', 'tomsmith')
      await page.type('#password', 'SuperSecretPassword!')
      await page.click('button[type="submit"]')
      await page.waitForSelector('#flash')

      // Assert that 'You logged into a secure area!' element exists
      expect(page.$('#flash')).to.be.exist
    })
  })

  describe('Manual Mode', function () {
    it('should login with valid credentials', async () => {
      await page.goto('https://the-internet.herokuapp.com/login')
      const axeController = new PuppeteerManualController(page)

      // Stop automatic axe analysis
      await axeController.stop()
      await axeController.analyze()

      await page.type('#username', 'tomsmith')
      await page.type('#password', 'SuperSecretPassword!')
      await page.click('button[type="submit"]')
      await page.waitForSelector('#flash')

      await axeController.analyze()

      // Restart automatic axe analysis
      await axeController.start()

      // Assert that 'You logged into a secure area!' element exists
      expect(page.$('#flash')).to.be.exist
    })
  })
})
