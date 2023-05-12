const { assert } = require('chai')
const playwright = require('playwright')
const {
  wrapPlaywright,
  PlaywrightController,
  playwrightConfig
} = require('@axe-core/watcher')

/* Get your configuration from environment variables. */
const {
  API_KEY = '900e0d86-b10a-445c-85a2-c8459178874c',
  SERVER_URL = 'http://localhost:3000'
} = process.env

describe('My Login Application', () => {
  let browserContext
  let page
  let controller

  before(async () => {
    browserContext = await playwright.chromium.launchPersistentContext(
      '',
      playwrightConfig({
        axe: {
          apiKey: API_KEY,
          serverURL: SERVER_URL
        },
        //@see: https://playwright.dev/docs/chrome-extensions#headless-mode
        headless: false,
        args: ['--headless=new']
      })
    )

    page = await browserContext.newPage()
    controller = new PlaywrightController(page)

    /* Wrap the Playwright browser context. */
    wrapPlaywright(browserContext, controller)
  })

  after(async () => {
    await browserContext.close()
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

        await page.locator('#username').fill('tomsmith')
        await page.locator('#password').fill('SuperSecretPassword!')

        await page.locator('button[type="submit"]').click()

        const element = await page.waitForSelector('#flash')

        assert.isNotNull(element)
      })
    })
  })
})
