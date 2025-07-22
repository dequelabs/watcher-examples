const { playwrightTest } = require('@axe-core/watcher')
const assert = require('assert')

const { SERVER_URL = 'https://axe.deque.com', API_KEY } = process.env
assert(API_KEY, 'API_KEY is required')

module.exports = playwrightTest({
  axe: {
    apiKey: API_KEY,
    serverURL: SERVER_URL
  },
  headless: false,
  args: ['--headless=new']
})
