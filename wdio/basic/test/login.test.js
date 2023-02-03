const wdio = require('webdriverio')
const { wdioConfig, WdioController, wrapWdio } = require('@axe-core/watcher')

// Get your configuration from environment variables.
const { API_KEY, SERVER_URL } = process.env

describe('My Login Application', () => {
  let browser
  let controller

  before(async () => {
    browser = await wdio.remote(
      wdioConfig({
        axe: {
          apiKey: API_KEY,
          serverURL: SERVER_URL
        },
        options: {
          capabilities: {
            browserName: 'chrome'
          }
        }
      })
    )

    // Initialize the axe Watcher controller.
    controller = new WdioController(browser)

    // Wrap the WDIO browser.
    wrapWdio(browser, controller)
  })

  afterEach(async () => {
    // Ensure that all the axe Watcher test results are flushed out.
    await controller.flush()
  })

  after(async () => {
    await browser.deleteSession()
  })

  it('should login with valid credentials', async () => {
    await browser.url('https://the-internet.herokuapp.com/login')
    await browser.$('#username').setValue('tomsmith')
    await browser.$('#password').setValue('SuperSecretPassword!')
    await browser.$('button[type="submit"]').click()
    await browser.$('#flash').waitForExist()
  })
})
