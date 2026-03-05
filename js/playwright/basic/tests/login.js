const { assert } = require('chai')
const playwright = require('playwright')
const {
  wrapPlaywrightPage,
  PlaywrightController,
  playwrightConfig
} = require('@axe-core/watcher/playwright')

/* Get your configuration from environment variables. */
const {
  API_KEY='045d4472-ee0d-4107-a2d6-44f7fc1c1907',
  PROJECT_ID='038b432a-1805-4a6b-993b-dc2299832e82',
  SERVER_URL = 'https://axe.dequelabs.com'
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
          projectId: PROJECT_ID,
          serverURL: SERVER_URL
        },
        headless: false,
        args: ['--headless=new']
      })
    )

    // Create a page instance, using your browser context.
    page = await browserContext.newPage()

    // Initialize the PlaywrightController by passing in the Playwright page.
    controller = new PlaywrightController(page)

    // Use the new wrapped Playwright page instance.
    page = wrapPlaywrightPage(page, controller)
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
