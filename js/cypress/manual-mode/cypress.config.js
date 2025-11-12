const { defineConfig } = require('cypress')
const { cypressConfig } = require('@axe-core/watcher')

// Get your configuration from environment variables.
const { API_KEY, PROJECT_ID, SERVER_URL = 'https://axe.deque.com' } = process.env

module.exports = defineConfig(
  cypressConfig({
    axe: {
      apiKey: API_KEY,
      projectId: PROJECT_ID,
      serverURL: SERVER_URL,
      // Prevent automatic analysis.
      autoAnalyze: false
    },
    defaultCommandTimeout: 10000
  })
)
