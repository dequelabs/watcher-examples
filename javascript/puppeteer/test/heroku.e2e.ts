import 'mocha'
import { expect } from 'chai'
import Puppeteer from 'puppeteer'
import { puppeteerConfig, PuppeteerManualController } from '@deque/watcher'
import { v4 } from 'uuid'

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('My Login Application', () => {
  let browser: Puppeteer.Browser
  let page: Puppeteer.Page

  const {
    AXE_SERVER_URL = 'http://localhost:3000',
    AXE_WATCHER_API_KEY = 'foobar'
  } = process.env

  if (!AXE_WATCHER_API_KEY) {
    throw new Error('AXE_WATCHER_API_KEY is not defined')
  }

  const AXE_WATCHER_SESSION_ID = v4()

  before(async () => {
    browser = await Puppeteer.launch(
      puppeteerConfig({
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

  it('login with valid credentials', async () => {
    await page.goto('https://the-internet.herokuapp.com/login')
    await delay(500)

    await page.type('#username', 'tomsmith')
    await page.type('#password', 'SuperSecretPassword!')
    await page.click('button[type="submit"]')
    await delay(500)

    expect(page.$('#flash')).to.be.exist
  })

  describe('Manual Mode', function () {
    it('should login with valid credentials', async () => {
      await page.goto('https://the-internet.herokuapp.com/login')
      const axeController = new PuppeteerManualController(page)
      await delay(500)

      // Stop automatic axe analysis
      await axeController.stop()
      await axeController.analyze()

      await page.type('#username', 'tomsmith')
      await page.type('#password', 'SuperSecretPassword!')
      await page.click('button[type="submit"]')
      await delay(500)

      await axeController.stop()
      await axeController.analyze()
      
      // Restart automatic axe analysis
      await axeController.stop()
    })
  })
})
