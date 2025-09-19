import 'mocha'
import { wdioConfig } from '@axe-core/watcher'
import { remote, RemoteOptions } from 'webdriverio'
import { getChromeBinaryPath } from '../../../utils/setup-chrome-chromedriver'

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
          args: [
            '--headless=new',
            '--no-sandbox'
          ],
          /*
           * You can use the utility to get the Chrome binary path, including installing Chrome, if needed.
           * This can be overridden by setting CHROME_BIN in the environment variables.
           * If you do not specify a binary, the default Chrome installation will be used.
           * This may cause issues, as Watcher does not support branded Chrome >= 139.
           */
          binary: getChromeBinaryPath()
        }
      }
    }) as RemoteOptions
  )
})

after(async () => {
  browser.deleteSession()
})

export { browser }
