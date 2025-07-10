const { defineConfig } = require('cypress')
const { cypressConfig } = require('@axe-core/watcher')

// Get your configuration from environment variables.
const { API_KEY, SERVER_URL = 'http://localhost:8888' } = process.env

module.exports = defineConfig(
  cypressConfig({
    axe: {
      apiKey: API_KEY,
      serverURL: SERVER_URL,
      excludeUrlPatterns: ['https://google.com']
    },
    defaultCommandTimeout: 10000
  })
)
