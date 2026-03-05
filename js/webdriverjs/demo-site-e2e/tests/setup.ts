import 'mocha'
import { Builder } from 'selenium-webdriver'
import { Options } from 'selenium-webdriver/chrome'
import {
  wrapWebdriver,
  webdriverConfig,
  WebdriverController
} from '@axe-core/watcher/selenium-webdriver'
import assert from 'assert'
import {
  getChromeBinaryPath
} from '../../../../utils/setup-chrome-chromedriver.js'

const {
  API_KEY = '98d4abfa-c329-4e3b-8ec4-7fce9cbbee8d',
  PROJECT_ID,
  SERVER_URL = 'http://localhost:3002',
  BUILD_ID
} = process.env
assert(API_KEY, 'API_KEY is required')

let browser: any
let controller: WebdriverController
let currentTestFile = ''
let currentDescribe = ''
let currentTestTitle = ''

before(async () => {
  const options = new Options()
  options.addArguments('--headless=new')
  options.addArguments('--no-sandbox')
  options.addArguments('--disable-setuid-sandbox')
  options.setBinaryPath(getChromeBinaryPath())

  browser = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(
      webdriverConfig({
        axe: {
          apiKey: API_KEY,
          projectId: PROJECT_ID,
          serverURL: SERVER_URL,
          timeout: { analyze: 60000, flush: 60000, network: 60000 },
          ...(BUILD_ID ? { buildID: BUILD_ID } : {})
        },
        options
      })
    )
    .build()

  controller = new WebdriverController(browser)
  browser = wrapWebdriver(browser, controller)
})

afterEach(async () => {
  controller.setTestContext({
    test_file: currentTestFile || null,
    test_title: currentTestTitle || null,
    describe_titles: currentDescribe ? [currentDescribe] : null
  })
  await controller.flush()
})

after(async () => {
  await browser.quit()
})

function setTestMeta(testFile: string, describe: string, title: string) {
  currentTestFile = testFile
  currentDescribe = describe
  currentTestTitle = title
}

export { browser, controller, setTestMeta }
