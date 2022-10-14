const puppeteer = require('puppeteer')
// Import the axe Watcher utilities.
const { puppeteerConfig, PuppeteerController } = require('@axe-core/watcher')

describe('My Login Application', () => {
  let browser
  let page

  before(async () => {
    // Launch a Playwright browser.
    browser = await puppeteer.launch(
      puppeteerConfig({
        // Configure axe Watcher.
        axe: {
          apiKey: '11dc1214-cd42-4882-b568-bfc7dc384c18', // 'YOUR_API_KEY'
          serverURL: 'http://localhost:3000' // 'YOUR_SERVER_URL'
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
  })

  afterEach(async () => {
    // Initialize the axe Watcher controller
    const controller = new PuppeteerController(page)
    // Ensure that all the axe Watcher test results are flushed out
    await controller.flush()
  })

  after(async () => {
    // Close the browser when your test is complete.
    await browser.close()
  })

  // Your example test.
  it('should login with valid credentials', async () => {
    await page.goto('https://the-internet.herokuapp.com/login')
    await page.type('#username', 'tomsmith')
    await page.type('#password', 'SuperSecretPassword!')
    await page.click('button[type="submit"]')
    await page.waitForSelector('#flash')
  })
})
