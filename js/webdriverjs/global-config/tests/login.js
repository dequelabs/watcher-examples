const { Builder, until } = require('selenium-webdriver')
const {
  wrapWebdriver,
  webdriverConfig,
  WebdriverController
} = require('@axe-core/watcher')
const { Options } = require('selenium-webdriver/chrome')
const {
  getChromeBinaryPath
} = require('../../../../utils/setup-chrome-chromedriver.js')

/* Get your configuration from environment variables. */
const { API_KEY, SERVER_URL = 'https://axe.deque.com' } = process.env

describe('My Login Application', () => {
  let browser
  let controller

  before(async () => {
    const options = new Options()
    options.addArguments('--headless=new')
    options.addArguments('--no-sandbox')
    /*
     * You can use the utility to get the Chrome binary path, including installing Chrome, if needed.
     * This can be overridden by setting CHROME_BIN in the environment variables.
     * If you do not specify a binary, the default Chrome installation will be used.
     * This may cause issues, as Watcher does not support branded Chrome >= 139.
     */
    options.setBinaryPath(getChromeBinaryPath())
    browser = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(
        webdriverConfig({
          axe: {
            apiKey: API_KEY,
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
          options
        })
      )
      .build()
    controller = new WebdriverController(browser)
    browser = wrapWebdriver(browser, controller)
  })

  after(async () => {
    await browser.quit()
  })

  afterEach(async () => {
    await controller.flush()
  })

  describe('with valid credentials', () => {
    it('should login', async () => {
      await browser.get('https://the-internet.herokuapp.com/login')

      const username = await browser.findElement({ id: 'username' })
      const password = await browser.findElement({ id: 'password' })

      await username.sendKeys('tomsmith')
      await password.sendKeys('SuperSecretPassword!')

      const submit = await browser.findElement({ css: 'button[type="submit"]' })
      await submit.click()

      await browser.wait(until.urlContains('/secure'))
    })
  })
})
