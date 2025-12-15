const { assert } = require('chai')
const puppeteer = require('puppeteer')
const {
  wrapPuppeteerPage,
  PuppeteerController,
  puppeteerConfig
} = require('@axe-core/watcher/puppeteer')

/* Get your configuration from environment variables. */
const {
  API_KEY,
  PROJECT_ID,
  SERVER_URL = 'https://axe.deque.com'
} = process.env

describe('My Login Application', () => {
  let browser
  let page
  let controller

  before(async () => {
    browser = await puppeteer.launch(
      puppeteerConfig({
        axe: {
          apiKey: API_KEY,
          projectId: PROJECT_ID,
          serverURL: SERVER_URL
        },
        headless: false,
        args: ['--headless=new', '--no-sandbox', '--disable-setuid-sandbox']
      })
    )
    // Create a page instance, using your browser instance.
    page = await browser.newPage()

    // Initialize the PuppeteerController by passing in the Puppeteer page.
    controller = new PuppeteerController(page)

    // Use the new wrapped Puppeteer page instance.
    page = wrapPuppeteerPage(page, controller)
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
