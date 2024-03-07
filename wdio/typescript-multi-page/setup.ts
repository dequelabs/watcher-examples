import 'mocha'
import { wdioConfig, WdioController, wrapWdio } from '@axe-core/watcher'
import { remote } from 'webdriverio'

/* Get your configuration from environment variables. */
const { API_KEY, SERVER_URL = 'https://axe.deque.com' } = process.env

let browser: WebdriverIO.Browser
let controller: WdioController

before(async () => {
  browser = await remote(
    wdioConfig({
      axe: {
        apiKey: API_KEY as string,
        serverURL: SERVER_URL
      },
      capabilities: {
        browserName: 'chrome'
      }
    })
  )

  controller = new WdioController(browser)
  wrapWdio(browser, controller)
})

afterEach(async () => {
  await controller.flush()
})

after(async () => {
  browser.deleteSession()
})

export { browser, controller }
