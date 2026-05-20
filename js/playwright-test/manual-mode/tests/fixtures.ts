import { playwrightTest } from '@axe-core/watcher/playwright-test'
import { getChromeBinaryPath } from '../../../../utils/setup-chrome-chromedriver'
import assert from 'assert'

const {
  API_KEY,
  PROJECT_ID,
  SERVER_URL = 'https://axe.deque.com'
} = process.env
assert(API_KEY, 'API_KEY is required')

const { test, expect } = playwrightTest({
  axe: {
    apiKey: API_KEY,
    projectId: PROJECT_ID,
    serverURL: SERVER_URL,
    /* Disable auto-analyze */
    autoAnalyze: false
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

export { test, expect }
