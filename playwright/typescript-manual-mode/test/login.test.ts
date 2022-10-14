import 'mocha'
import playwright from 'playwright'
import { playwrightConfig, PlaywrightController } from '@axe-core/watcher'

describe('My Login Application', () => {
  let browser: playwright.BrowserContext
  let page: playwright.Page
  let controller: PlaywrightController

  before(async () => {
    browser = await playwright.chromium.launchPersistentContext(
      '',
      playwrightConfig({
        axe: {
          apiKey: '11dc1214-cd42-4882-b568-bfc7dc384c18', // 'YOUR_API_KEY'
          serverURL: 'http://localhost:3000' // 'YOUR_SERVER_URL'
        }
      })
    )
    page = await browser.newPage()

    // Initialize the axe Watcher controller
    controller = new PlaywrightController(page)

    // Prevent automatic analysis.
    await controller.stop()
  })

  afterEach(async () => {
    // Ensure that all the axe Watcher test results are flushed out
    await controller.flush()
  })

  after(async () => {
    await browser.close()
  })

  it('should login with valid credentials', async () => {
    await page.goto('https://the-internet.herokuapp.com/login')
    // Manually analyze the page in its initial state.
    await controller.analyze()
    await page.fill('#username', 'tomsmith')
    await page.fill('#password', 'SuperSecretPassword!')
    await page.click('button[type="submit"]')
    // The page state has changed, so manually analyze the page again.
    await controller.analyze()
    await page.waitForSelector('#flash')
    // Analyze the page again, at the end state.
    await controller.analyze()
  })
})