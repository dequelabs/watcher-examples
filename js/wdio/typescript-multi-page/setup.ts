import 'mocha'
import { wdioConfig } from '@axe-core/watcher'
import { remote, RemoteOptions } from 'webdriverio'

/* Get your configuration from environment variables. */
const { API_KEY, SERVER_URL = 'https://axe.deque.com' } = process.env

let browser: WebdriverIO.Browser

before(async () => {
  browser = await remote(
    wdioConfig({
      axe: {
        apiKey: API_KEY as string,
        serverURL: SERVER_URL
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
    }) as RemoteOptions
  )
})

after(async () => {
  browser.deleteSession()
})

export { browser }
