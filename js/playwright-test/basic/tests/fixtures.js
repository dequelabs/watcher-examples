const { playwrightTest } = require('@axe-core/watcher')
const assert = require('assert')

const { API_KEY, PROJECT_ID, SERVER_URL = 'https://axe.deque.com' } = process.env
assert(API_KEY, 'API_KEY is required')

module.exports = playwrightTest({
  axe: {
    apiKey: API_KEY,
    projectId: PROJECT_ID,
    serverURL: SERVER_URL
  },
  headless: false,
  args: ['--headless=new']
})
