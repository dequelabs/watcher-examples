import 'mocha'
import { wdioConfig } from '@axe-core/watcher/webdriverio'
import { remote, RemoteOptions } from 'webdriverio'
import {
  getChromeBinaryPath,
  getChromedriverBinaryPath
} from '../../../utils/setup-chrome-chromedriver'

/* Get your configuration from environment variables. */
const {
  API_KEY,
  PROJECT_ID,
  SERVER_URL = 'https://axe.deque.com'
} = process.env

let browser: WebdriverIO.Browser

before(async () => {
  browser = await remote(
    wdioConfig({
      axe: {
        apiKey: API_KEY as string,
        projectId: PROJECT_ID as string,
        serverURL: SERVER_URL
      },
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: ['--headless=new', '--no-sandbox'],
          /*
           * You can use the utility to get the Chrome binary path, including installing Chrome, if needed.
           * This can be overridden by setting CHROME_BIN in the environment variables.
           * If you do not specify a binary, the default Chrome installation will be used.
           * This may cause issues, as Watcher does not support branded Chrome >= 139.
           */
          binary: getChromeBinaryPath()
        },
        /*
         * Pin chromedriver to the binary installed alongside Chrome
         * (overridable via CHROMEDRIVER_BIN). Without this, wdio's
         * Selenium Manager may auto-download a chromedriver that
         * mismatches the Chrome binary above.
         */
        'wdio:chromedriverOptions': {
          binary: getChromedriverBinaryPath()
        }
      }
    }) as RemoteOptions
  )
})

after(async () => {
  browser.deleteSession()
})

export { browser }
