import 'mocha'
import { remote, Browser } from 'webdriverio'
import { wdioConfig, WdioController } from '@axe-core/watcher'

// Get your configuration from environment variables.
const { API_KEY, SERVER_URL } = process.env

describe('My Login Application', () => {
  let browser: Browser<'async'>
  let controller: WdioController

  before(async () => {
    browser = await remote(
      wdioConfig({
        axe: {
          apiKey: API_KEY as string,
          serverURL: SERVER_URL,
          // Prevent automatic analysis.
          autoAnalyze: false
        },
        options: {
          capabilities: {
            browserName: 'chrome'
          }
        }
      })
    )

    // Initialize the axe Watcher controller
    controller = new WdioController(browser)
  })

  afterEach(async () => {
    // Ensure that all the axe Watcher test results are flushed out
    await controller.flush()
  })

  after(async () => {
    await browser.deleteSession()
  })

  it('should login with valid credentials', async () => {
    await browser.url('https://the-internet.herokuapp.com/login')
    // Manually analyze the page.
    await controller.analyze()
    await browser.$('#username').setValue('tomsmith')
    await browser.$('#password').setValue('SuperSecretPassword!')
    await browser.$('button[type="submit"]').click()
    // The page state has changed, so manually analyze the page again.
    await controller.analyze()
    await browser.$('#flash').waitForExist()
    // Analyze the page again, and the end state.
    await controller.analyze()
  })
})
