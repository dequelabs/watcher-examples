const { defineConfig } = require('cypress')
const { cypressConfig } = require('@axe-core/watcher')

// Get your configuration from environment variables.
const { API_KEY, SERVER_URL } = process.env

module.exports = defineConfig(
  cypressConfig({
    axe: {
      apiKey: 'b2daae81-c751-43e7-a133-bcfcddd4c858',
      serverURL: 'https://axe.dequelabs.com/'
    },
    defaultCommandTimeout: 10000
  })
)
