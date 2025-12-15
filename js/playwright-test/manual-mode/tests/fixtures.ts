import { playwrightTest } from '@axe-core/watcher/playwright-test'
import assert from 'assert'

const { SERVER_URL = 'https://axe.deque.com', API_KEY } = process.env
assert(API_KEY, 'API_KEY is required')

const { test, expect } = playwrightTest({
  axe: {
    apiKey: API_KEY,
    serverURL: SERVER_URL,
    /* Disable auto-analyze */
    autoAnalyze: false
  },
  headless: false,
  args: ['--headless=new']
})

export { test, expect }
