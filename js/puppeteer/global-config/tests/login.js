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
