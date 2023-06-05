import 'mocha'
import puppeteer, {
  type Page,
  type Browser,
  type BrowserContext
} from 'puppeteer'
import {
  puppeteerConfig,
  PuppeteerController,
  wrapPuppeteer
} from '@axe-core/watcher'
import assert from 'assert'

const { API_KEY, SERVER_URL = 'https://axe.deque.com' } = process.env
assert(API_KEY, 'API_KEY is required')

let page: Page
let browser: Browser
let browserContext: BrowserContext
let controller: PuppeteerController

before(async () => {
  browser = await puppeteer.launch(
    puppeteerConfig({
      axe: {
        apiKey: API_KEY,
        serverURL: SERVER_URL
      },
      headless: false
    })
  )
  browserContext = browser.browserContexts()[0]
})

beforeEach(async () => {
  page = await browser.newPage()
  controller = new PuppeteerController(page)
  wrapPuppeteer(browserContext, controller)
})

afterEach(async () => {
  await controller.flush()
  console.log('FLUSHHHHH')
  await page.close()
})

after(async () => {
  await browser.close()
})

export { page, controller, browser }
