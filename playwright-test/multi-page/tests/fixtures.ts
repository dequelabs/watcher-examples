import { playwrightTest } from '@axe-core/watcher'
import assert from 'assert'

const { SERVER_URL = 'https://axe.deque.com', API_KEY } = process.env
assert(API_KEY, 'API_KEY is required')

const { test, expect } = playwrightTest({
  axe: {
    apiKey: API_KEY,
    serverURL: SERVER_URL
  },
  headless: false
})

export { test, expect }
