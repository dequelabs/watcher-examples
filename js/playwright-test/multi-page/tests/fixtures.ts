import { playwrightTest } from '@axe-core/watcher'
import assert from 'assert'

const { API_KEY, PROJECT_ID, SERVER_URL = 'https://axe.deque.com' } = process.env
assert(API_KEY, 'API_KEY is required')

const { test, expect } = playwrightTest({
  axe: {
    apiKey: API_KEY,
    projectId: PROJECT_ID,  
    serverURL: SERVER_URL
  },
  headless: false,
  args: ['--headless=new']
})

export { test, expect }
