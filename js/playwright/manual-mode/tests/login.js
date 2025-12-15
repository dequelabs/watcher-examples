const { assert } = require('chai')
const playwright = require('playwright')
const {
  wrapPlaywrightPage,
  PlaywrightController,
  playwrightConfig
} = require('@axe-core/watcher/playwright')

/* Get your configuration from environment variables. */
const { API_KEY, SERVER_URL = 'https://axe.deque.com' } = process.env

describe('My Application', () => {
  let browserContext
  let page
  let controller

  before(async () => {
    browserContext = await playwright.chromium.launchPersistentContext(
      '',
      playwrightConfig({
        axe: {
          apiKey: API_KEY,
          serverURL: SERVER_URL,
          /* Disable automatic analysis. */
          autoAnalyze: false
        },
        //@see: https://playwright.dev/docs/chrome-extensions#headless-mode
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

  /*
    Let's see the number of page states calculation.
    As auto-analyze is false, it will not analyze automatically.

    We first navigate to the page.
    Then we analyze the page. (+1)
    Then we fill the form.
    Then Turn on auto-analyze.
    Then we click the submit button (+1)
    Then we wait for the element to appear.
    Then we analyze the page. (+1)
    So, the total number of page states calculation should be 3.
  */
  describe('Login', () => {
    describe('with valid credentials', () => {
      it('should login', async () => {
        await page.goto('https://the-internet.herokuapp.com/login')

        /* Analyze after navigating to the page. */
        await controller.analyze()

        await page.locator('#username').fill('tomsmith')
        await page.locator('#password').fill('SuperSecretPassword!')

        /* starts auto-analyze to true */
        await controller.start()

        /* analyze automatically as auto-analyze it true*/
        await page.locator('button[type="submit"]').click()

        const element = await page.waitForSelector('#flash')

        /* stops auto-analyze */
        await controller.stop()

        /* Analyze after logging in. */
        await controller.analyze()

        assert.isNotNull(element)
      })
    })
  })
})
