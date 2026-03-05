import { playwrightTest } from '@axe-core/watcher/playwright-test'
import assert from 'assert'

const {
  API_KEY = '98d4abfa-c329-4e3b-8ec4-7fce9cbbee8d',
  PROJECT_ID ='4d6fe94e-0eb1-4f12-8ed2-467f258bc33a',
  SERVER_URL = 'http://localhost:3002',
  BUILD_ID
} = process.env

assert(API_KEY, 'API_KEY is required')
assert(BUILD_ID, 'BUILD_ID is required — set via env or use npm test which generates one')

const { test, expect } = playwrightTest({
  axe: {
    apiKey: API_KEY,
    projectId: PROJECT_ID,
    serverURL: SERVER_URL,
    buildID: BUILD_ID,
    timeout: { analyze: 60000, flush: 60000, network: 60000 }
  },
  headless: false,
  args: ['--headless=new']
})

export { test, expect }
