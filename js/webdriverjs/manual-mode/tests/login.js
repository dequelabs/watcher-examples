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
            /* Disable automatic analysis. */
            autoAnalyze: false
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

  /*
    Let's see the number of page states calculation.

    As the auto-analyze is false, it will not analyze automatically
    Then we navigate to the page.
    Then we analyze the page. (+1)
    Then we fill the form.
    Then Turn on auto-analyze.
    Then we click the submit button (+1)
    Then we wait for the element to appear.
    Then we analyze the page. (+1)

    So, the total number of page states calculation should be 3.

  */
  describe('with valid credentials', () => {
    it('should login', async () => {
      await browser.get('https://the-internet.herokuapp.com/login')

      /* Analyze after navigating to the page. */
      await controller.analyze()

      const username = await browser.findElement({ id: 'username' })
      const password = await browser.findElement({ id: 'password' })

      await username.sendKeys('tomsmith')
      await password.sendKeys('SuperSecretPassword!')

      /* Start automatic axe analysis. */
      await controller.start()

      const submit = await browser.findElement({ css: 'button[type="submit"]' })
      await submit.click()

      await browser.wait(until.elementLocated({ id: 'flash' }))

      /* Stop automatic axe analysis. */
      await controller.stop()

      /* Analyze after logging in. */
      await controller.analyze()

      await browser.wait(until.urlContains('/secure'))
    })
  })
})
