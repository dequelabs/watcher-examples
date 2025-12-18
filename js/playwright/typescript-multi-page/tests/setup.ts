import 'mocha'
import playwright from 'playwright'
import {
  playwrightConfig,
  PlaywrightController,
  wrapPlaywrightPage
} from '@axe-core/watcher/playwright'
import assert from 'assert'

const {
  API_KEY,
  PROJECT_ID,
  SERVER_URL = 'https://axe.deque.com'
} = process.env
assert(API_KEY, 'API_KEY is required')

let page: playwright.Page
let browserContext: playwright.BrowserContext
let controller: PlaywrightController

before(async () => {
  browserContext = await playwright.chromium.launchPersistentContext(
    '',
    playwrightConfig({
      axe: {
        apiKey: API_KEY,
        projectId: PROJECT_ID,
        serverURL: SERVER_URL
      },
      headless: false,
      args: ['--headless=new']
    })
  )
})

beforeEach(async () => {
  // Create a page instance, using your browser context.
  page = await browserContext.newPage()

  // Initialize the PlaywrightController by passing in the Playwright page.
  controller = new PlaywrightController(page)

  // Use the new wrapped Playwright page instance.
  page = wrapPlaywrightPage(page, controller)
})

afterEach(async () => {
  await controller.flush()
})

after(async () => {
  await browserContext.close()
})

export { page, controller, browserContext }
