import 'mocha'
import puppeteer, { type Page, type Browser } from 'puppeteer'
import {
  puppeteerConfig,
  PuppeteerController,
  wrapPuppeteerPage
} from '@axe-core/watcher/puppeteer'
import { getChromeBinaryPath } from '../../../../utils/setup-chrome-chromedriver'
import assert from 'assert'

const {
  API_KEY,
  PROJECT_ID,
  SERVER_URL = 'https://axe.deque.com'
} = process.env
assert(API_KEY, 'API_KEY is required')

let page: Page
let browser: Browser
let controller: PuppeteerController

before(async () => {
  browser = await puppeteer.launch(
    puppeteerConfig({
      axe: {
        apiKey: API_KEY,
        projectId: PROJECT_ID,
        serverURL: SERVER_URL
      },
      /*
       * Use the same Chrome binary as the rest of the CI matrix
       * (overridable via CHROME_BIN); falls back to installing
       * Chrome stable locally when the env var is not set.
       */
      executablePath: getChromeBinaryPath(),
      headless: false,
      args: ['--headless=new', '--no-sandbox', '--disable-setuid-sandbox']
    })
  )
})

beforeEach(async () => {
  // Create a page instance, using your browser instance.
  page = await browser.newPage()

  // Initialize the PuppeteerController by passing in the Puppeteer page.
  controller = new PuppeteerController(page)

  // Use the new wrapped Puppeteer page instance.
  page = wrapPuppeteerPage(page, controller)
})

afterEach(async () => {
  await controller.flush()
  await page.close()
})

after(async () => {
  await browser.close()
})

export { page, controller, browser }
