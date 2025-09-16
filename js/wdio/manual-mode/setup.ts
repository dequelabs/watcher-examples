import 'mocha'
import { wdioConfig, WdioController, wrapWdio } from '@axe-core/watcher'
import { remote } from 'webdriverio'

/* Get your configuration from environment variables. */
const {
  API_KEY = '72bcba02-2ce1-474b-a27d-0e68e9a364c5',
  SERVER_URL = 'https://axe.dequelabs.com'
} = process.env

let browser: WebdriverIO.Browser
let controller: WdioController

before(async () => {
  browser = await remote(
    wdioConfig({
      axe: {
        apiKey: API_KEY as string,
        serverURL: SERVER_URL,
        /* Disable automatic analysis */
        autoAnalyze: false
      },
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: ['--headless=new']
          /* 
          If the version of Chrome wdio will use is Google Chrome >= 139,
          you must specify the path to a Chromium or Google Chrome for Testing binary instead. 
          Chrome versions can be installed and managed using @puppeteer/browsers.
          */
          // binary: '/path/to/Chromium/or/Google Chrome for Testing'
        }
      }
    })
  )

  controller = new WdioController(browser)
  wrapWdio(browser, controller)
})

afterEach(async () => {
  // times out
  await controller.flush()
})

after(async () => {
  browser.deleteSession()
})

export { browser, controller }
