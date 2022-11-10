import 'mocha'
import puppeteer from 'puppeteer'
// Import the axe Watcher utilities.
import { puppeteerConfig, PuppeteerController } from '@axe-core/watcher'

// Get your configuration from environment variables.
const { API_KEY, SERVER_URL } = process.env

describe('My Login Application', () => {
  let browser: puppeteer.Browser
  let page: puppeteer.Page
  let controller: PuppeteerController

  before(async () => {
    // Launch a Playwright browser.
    browser = await puppeteer.launch(
      puppeteerConfig({
        // Configure axe Watcher.
        axe: {
          apiKey: API_KEY as string,
          serverURL: SERVER_URL,
          autoAnalyze: false
        },
        // Configure Puppeteer.
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-features=DialMediaRouteProvider'
        ]
      })
    )
    // Create a new page.
    page = await browser.newPage()

    // Initialize the axe Watcher controller
    controller = new PuppeteerController(page)

    // Prevent automatic analysis.
    await controller.stop()
  })

  afterEach(async () => {
    // Ensure that all the axe Watcher test results are flushed out
    await controller.flush()
  })

  after(async () => {
    // Close the browser when your test is complete.
    await browser.close()
  })

  // Your example test.
  it('should login with valid credentials', async () => {
    // Manually analyze the page in its initial state.
    await page.goto('https://the-internet.herokuapp.com/login')
    await controller.analyze()
    await page.type('#username', 'tomsmith')
    await page.type('#password', 'SuperSecretPassword!')
    await page.click('button[type="submit"]')
    // The page state has changed, so manually analyze the page again.
    await controller.analyze()
    await page.waitForSelector('#flash')
    // Analyze the page again, at the end state.
    await controller.analyze()
  })
})
