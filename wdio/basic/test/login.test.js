const wdio = require('webdriverio')
const { wdioConfig, WdioController } = require('@axe-core/watcher')

// Get your configuration from environment variables.
const { API_KEY, SERVER_URL } = process.env

describe('My Login Application', () => {
  let browser

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
  })

  afterEach(async () => {
    // Initialize the axe Watcher controller
    const controller = new WdioController(browser)
    // Ensure that all the axe Watcher test results are flushed out
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
