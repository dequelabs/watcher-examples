const { assert } = require('chai')
const playwright = require('playwright')
const {
  wrapPlaywrightPage,
  PlaywrightController,
  playwrightConfig
} = require('@axe-core/watcher/playwright')
const {
  getChromeBinaryPath
} = require('../../../../utils/setup-chrome-chromedriver.js')

/* Get your configuration from environment variables. */
const {
  API_KEY,
  PROJECT_ID,
  SERVER_URL = 'https://axe.deque.com'
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
        /*
         * Use the same Chrome binary as the rest of the CI matrix
         * (overridable via CHROME_BIN); falls back to installing
         * Chrome stable locally when the env var is not set.
         */
        executablePath: getChromeBinaryPath(),
        //@see: https://playwright.dev/docs/chrome-extensions#headless-mode
        headless: false,
        args: ['--headless=new']
      })
    )
  })

  after(async () => {
    await browserContext.close()
  })

  // Note: function expression (not arrow) so `this.currentTest` is bound
  // to Mocha's Context. Arrow functions would leave it undefined.
  beforeEach(async function () {
    // Create a fresh page instance for each test.
    page = await browserContext.newPage()

    // Initialize the PlaywrightController by passing in the Playwright page.
    controller = new PlaywrightController(page)

    // Use the new wrapped Playwright page instance.
    page = wrapPlaywrightPage(page, controller)

    // Tell axe Watcher which test each scan in this test belongs to.
    controller.setTestContext({
      test_file_path: this.currentTest?.file ?? null,
      test_location: this.currentTest?.titlePath() ?? null
    })
  })

  afterEach(async () => {
    /* Flush axe-watcher results after each test. */
    await controller.flush()

    // Clear so no stray scan after flush picks up the previous test's context.
    controller.setTestContext(null)

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

      it('should be able to logout', async () => {
        await page.goto('https://the-internet.herokuapp.com/login')

        await page.locator('#username').fill('tomsmith')
        await page.locator('#password').fill('SuperSecretPassword!')
        await page.locator('button[type="submit"]').click()

        await page.waitForSelector('#flash')

        // Logout and verify we're back on the login page
        await page.locator('a[href="/logout"]').click()

        await page.waitForSelector('#flash')
      })
    })
  })
})
