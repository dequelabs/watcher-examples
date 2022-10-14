const { defineConfig } = require('cypress')
const { cypressConfig } = require('@axe-core/watcher')

module.exports = defineConfig(
  cypressConfig({
    axe: {
      apiKey: '11dc1214-cd42-4882-b568-bfc7dc384c18', // 'YOUR_API_KEY'
      serverURL: 'http://localhost:3000' // 'YOUR_SERVER_URL'
    }
  })
)
