const { defineConfig } = require('cypress')
const { cypressConfig } = require('@axe-core/watcher')

// Get your configuration from environment variables.
const { API_KEY, SERVER_URL = 'https://axe.deque.com' } = process.env

module.exports = defineConfig(
  cypressConfig({
    axe: {
      apiKey: API_KEY,
      serverURL: SERVER_URL
    },
    defaultCommandTimeout: 10000
  })
)
