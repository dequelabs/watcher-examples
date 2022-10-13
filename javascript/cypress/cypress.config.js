const { defineConfig } = require('cypress')
const { cypressConfig } = require('@axe-core/watcher')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({
  path: path.join(__dirname, '..', '..', '.env')
})

const { AXE_SERVER_URL, AXE_WATCHER_API_KEY } = process.env

module.exports = defineConfig(
  cypressConfig({
    axe: {
      apiKey: AXE_WATCHER_API_KEY,
      serverURL: AXE_SERVER_URL
    }
  })
)
