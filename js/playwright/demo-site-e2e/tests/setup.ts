import 'mocha'
import playwright from 'playwright'
import {
  playwrightConfig,
  PlaywrightController,
  wrapPlaywrightPage
} from '@axe-core/watcher/playwright'
import assert from 'assert'

const {
  API_KEY = '98d4abfa-c329-4e3b-8ec4-7fce9cbbee8d',
  PROJECT_ID = 'e64ca535-c329-4c25-8ef9-fbc9dd7bc706',
  SERVER_URL = 'http://localhost:4000',
  BUILD_ID
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
        serverURL: SERVER_URL,
       // AXE_IS_CI: true,
        ...(BUILD_ID ? { buildID: BUILD_ID } : {})
      },
      headless: false,
      args: ['--headless=new']
    })
  )
})

beforeEach(async () => {
  page = await browserContext.newPage()
  controller = new PlaywrightController(page)
  page = wrapPlaywrightPage(page, controller)
})

afterEach(async () => {
  await controller.flush()
})

after(async () => {
  await browserContext.close()
})

export { page, controller, browserContext }
