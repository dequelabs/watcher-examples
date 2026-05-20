const { playwrightTest } = require('@axe-core/watcher/playwright-test')
const {
  getChromeBinaryPath
} = require('../../../../utils/setup-chrome-chromedriver.js')
const assert = require('assert')

const {
  API_KEY,
  PROJECT_ID,
  SERVER_URL = 'https://axe.deque.com'
} = process.env
assert(API_KEY, 'API_KEY is required')

module.exports = playwrightTest({
  axe: {
    apiKey: API_KEY,
    projectId: PROJECT_ID,
    serverURL: SERVER_URL
  },
  /*
   * Use the same Chrome binary as the rest of the CI matrix
   * (overridable via CHROME_BIN); falls back to installing
   * Chrome stable locally when the env var is not set.
   */
  executablePath: getChromeBinaryPath(),
  headless: false,
  args: ['--headless=new']
})
