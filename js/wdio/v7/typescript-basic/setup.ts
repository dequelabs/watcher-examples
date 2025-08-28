import 'mocha'
import { wdioConfig, WdioController, wrapWdio } from '@axe-core/watcher'
import { remote, type Browser } from 'webdriverio'

/* Get your configuration from environment variables. */
const { API_KEY, SERVER_URL = 'https://axe.deque.com' } = process.env

/**
 * As of V8, WebdriverIO removed the deprecated the @wdio/sync package.
 * To use @axe-core/watcher on V7 of WebdriverIO
 * you'll need to use the type `Browser<'async'>` instead of `Browser`.
 *
 * @see https://webdriver.io/blog/2021/07/28/sync-api-deprecation/
 *
 * In addition, if you're using Node 18 and encounter the following error:
 * `FetchError: Failed to fetch browser webSocket URL from ...`.
 *
 * You may need to downgrade to Node 16.
 *
 * @see https://github.com/webdriverio/webdriverio/issues/8279
 */
let browser: Browser<'async'>

let controller: WdioController

before(async () => {
  browser = await remote(
    wdioConfig({
      axe: {
        apiKey: API_KEY as string,
        serverURL: SERVER_URL
      },
      capabilities: {
        browserName: 'chrome',
        browserVersion: '138',
        'goog:chromeOptions': { args: ['--headless=new', '--no-sandbox'] }
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

export { browser }
