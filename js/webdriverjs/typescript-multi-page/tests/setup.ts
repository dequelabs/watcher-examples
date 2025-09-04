import 'mocha'
import { Builder, type WebDriver } from 'selenium-webdriver'
import {
  wrapWebdriver,
  webdriverConfig,
  WebdriverController
} from '@axe-core/watcher'
import { Options } from 'selenium-webdriver/chrome'

/* Get your configuration from environment variables. */
const { API_KEY, SERVER_URL = 'https://axe.deque.com' } = process.env

let browser: WebDriver
let controller: WebdriverController

before(async () => {
  const options = new Options()
  options.addArguments('--headless=new')
  browser = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(
      webdriverConfig({
        axe: {
          apiKey: API_KEY as string,
          serverURL: SERVER_URL
        },
        options
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
