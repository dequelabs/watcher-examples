import 'mocha'
import { Builder, type WebDriver } from 'selenium-webdriver'
import {
  wrapWebdriver,
  webdriverConfig,
  WebdriverController
} from '@axe-core/watcher'

/* Get your configuration from environment variables. */
const { API_KEY, SERVER_URL = 'https://axe.deque.com' } = process.env

let browser: WebDriver
let controller: WebdriverController

before(async () => {
  browser = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(
      webdriverConfig({
        axe: {
          apiKey: API_KEY as string,
          serverURL: SERVER_URL
        }
      })
    )
    .build()
  controller = new WebdriverController(browser)
  browser = wrapWebdriver(browser, controller)
})

afterEach(async () => {
  await controller.flush()
})

after(async () => {
  await browser.quit()
})

export { browser, controller }
