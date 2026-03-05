import { wdioTestRunner } from '@axe-core/watcher/webdriverio'
import {
  getChromeBinaryPath,
  getChromedriverBinaryPath
} from '../../../utils/setup-chrome-chromedriver.js'

const {
  API_KEY = '98d4abfa-c329-4e3b-8ec4-7fce9cbbee8d',
  PROJECT_ID,
  SERVER_URL = 'http://localhost:3002',
  BUILD_ID
} = process.env

export const config = wdioTestRunner({
  axe: {
    apiKey: API_KEY as string,
    projectId: PROJECT_ID as string,
    serverURL: SERVER_URL,
    timeout: { analyze: 60000, flush: 60000, network: 60000 },
    ...(BUILD_ID ? { buildID: BUILD_ID } : {})
  },
  specs: [
    'home-page.test.ts',
    'shop-page.test.ts',
    'product-page.test.ts',
    'forms-and-misc.test.ts'
  ],
  capabilities: [
    {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: ['--headless=new', '--no-sandbox'],
        binary: getChromeBinaryPath()
      }
    }
  ],
  services: [
    [
      'chromedriver',
      {
        chromedriverCustomPath: getChromedriverBinaryPath()
      }
    ]
  ],
  baseUrl: 'https://axe-devtools-web-demo.vercel.app',
  framework: 'mocha',
  reporters: ['spec'],
  maxInstances: 1,
  mochaOpts: {
    timeout: 300000
  }
})
