import 'mocha'
import puppeteer from 'puppeteer'
import {
  puppeteerConfig,
  PuppeteerController,
  wrapPuppeteerPage
} from '@axe-core/watcher/puppeteer'
import assert from 'assert'

const {
  API_KEY = '98d4abfa-c329-4e3b-8ec4-7fce9cbbee8d',
  PROJECT_ID,
  SERVER_URL = 'http://localhost:3002',
  BUILD_ID
} = process.env
assert(API_KEY, 'API_KEY is required')

let page: any
let browser: any
let controller: PuppeteerController
let currentTestFile = ''
let currentDescribe = ''
let currentTestTitle = ''

before(async () => {
  browser = await puppeteer.launch(
    puppeteerConfig({
      axe: {
        apiKey: API_KEY,
        projectId: PROJECT_ID,
        serverURL: SERVER_URL,
        timeout: { analyze: 60000, flush: 60000, network: 60000 },
        ...(BUILD_ID ? { buildID: BUILD_ID } : {})
      },
      headless: false,
      args: ['--headless=new', '--no-sandbox', '--disable-setuid-sandbox']
    }) as any
  )
})

beforeEach(async () => {
  page = await browser.newPage()
  controller = new PuppeteerController(page)
  page = wrapPuppeteerPage(page, controller)
})

afterEach(async () => {
  controller.setTestContext({
    test_file: currentTestFile || null,
    test_title: currentTestTitle || null,
    describe_titles: currentDescribe ? [currentDescribe] : null
  })
  await controller.flush()
  await page.close()
})

after(async () => {
  await browser.close()
})

function setTestMeta(testFile: string, describe: string, title: string) {
  currentTestFile = testFile
  currentDescribe = describe
  currentTestTitle = title
}

export { page, controller, browser, setTestMeta }
