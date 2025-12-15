const { defineConfig } = require('cypress')
const { cypressConfig } = require('@axe-core/watcher/cypress/config')

// Get your configuration from environment variables.
const { API_KEY, SERVER_URL = 'https://axe.deque.com' } = process.env

module.exports = defineConfig(
  cypressConfig({
    axe: {
      apiKey: API_KEY,
      serverURL: SERVER_URL,
      // Prevent automatic analysis.
      autoAnalyze: false
    },
    defaultCommandTimeout: 10000
  })
)
