const { assert } = require('chai')
const playwright = require('playwright')
const {
  wrapPlaywrightPage,
  PlaywrightController,
  playwrightConfig
} = require('@axe-core/watcher')

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
          serverURL: SERVER_URL,
          /**
           * configurationOverrides allows users to override the org-wide settings
           * configured in the axe account.
           *
           * Notes:
           *  1. If you do not wish to override a specific field, simply omit it from this object.
           *  2. If you lack permission to override a particular field, the configuration will not proceed.
           *  3. For more details on using global configurations, visit:
           *     https://docs.deque.com/developer-hub/2/en/dh-global-configuration
           *  4. For more information on the configurationOverrides object, see:
           *     https://docs.deque.com/developer-hub/2/en/dh-api-reference#configurationoverrides-interface
           */
          configurationOverrides: {
            accessibilityStandard: 'WCAG 2.2 AAA', // Defines the accessibility standard to apply during axe-core scans
            axeCoreVersion: '4.10.2', // Specifies the version of axe-core to use
            bestPractices: true, // Enables or disables axe-core best practice rules
            experimentalRules: true // Enables or disables experimental axe-core rules
          }
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
