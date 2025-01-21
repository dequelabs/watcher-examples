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
        serverURL: SERVER_URL,
        autoAnalyze: false
      },
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': { args: ['--headless=new'] }
      }
    }) as RemoteOptions
  )
})

after(async () => {
  browser.deleteSession()
})

export { browser }
