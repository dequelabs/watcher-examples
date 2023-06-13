const { assert } = require('chai')
const puppeteer = require('puppeteer')
const {
  wrapPuppeteer,
  PuppeteerController,
  puppeteerConfig
} = require('@axe-core/watcher')

/* Get your configuration from environment variables. */
const { API_KEY, SERVER_URL = 'https://axe.deque.com' } = process.env

describe('My Login Application', () => {
  let browser
  let page
  let controller

  before(async () => {
    browser = await puppeteer.launch(
      puppeteerConfig({
        axe: {
          apiKey: API_KEY,
          serverURL: SERVER_URL
        },
        headless: false
      })
    )
    const browserContext = browser.browserContexts()[0]
    page = await browser.newPage()
    controller = new PuppeteerController(page)
    wrapPuppeteer(browserContext, controller)
  })

  after(async () => {
    await browser.close()
  })

  afterEach(async () => {
    /* Flush axe-watcher results after each test. */
    await controller.flush()
    await page.close()
  })

  describe('Login', () => {
    describe('with valid credentials', () => {
      it('should login', async () => {
        await page.goto('https://the-internet.herokuapp.com/login')

        await page.type('#username', 'tomsmith')
        await page.type('#password', 'SuperSecretPassword!')

        await page.click('button[type="submit"]')

        const element = await page.waitForSelector('#flash')
        assert.isNotNull(element)
      })
    })
  })
})
