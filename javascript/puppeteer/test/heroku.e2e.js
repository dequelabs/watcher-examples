const puppeteer = require('puppeteer')
const { expect } = require('chai')
const path = require('path')
require('dotenv').config({
  path: path.join(__dirname, '..', '..', '..', '.env')
})

const { puppeteerConfig, PuppeteerController } = require('@axe-core/watcher')

const { AXE_SERVER_URL, AXE_WATCHER_API_KEY } = process.env

describe('My Login Application', () => {
  let browser
  let page
  let controller

  before(async () => {
    browser = await puppeteer.launch(
      puppeteerConfig({
        axe: {
          apiKey: AXE_WATCHER_API_KEY,
          serverURL: AXE_SERVER_URL
        },
        args: ['--disable-features=DialMediaRouteProvider']
      })
    )

    page = await browser.newPage()

    // initialize the axe Watcher controller
    controller = new PuppeteerController(page)
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
      // Stop automatic axe analysis
      await controller.stop()

      await page.goto('https://the-internet.herokuapp.com/login')

      await controller.analyze()

      await page.type('#username', 'tomsmith')
      await page.type('#password', 'SuperSecretPassword!')
      await page.click('button[type="submit"]')
      await page.waitForSelector('#flash')

      await controller.analyze()

      // Restart automatic axe analysis
      await controller.start()

      // Assert that 'You logged into a secure area!' element exists
      expect(page.$('#flash')).to.be.exist
    })
  })
})
