const { wdioTestRunner, WdioController } = require('@axe-core/watcher')

// Get your configuration from environment variables.
const { API_KEY, SERVER_URL } = process.env

const config = {
  specs: ['./test/*.test.js'],
  capabilities: [{ browserName: 'chrome' }],
  baseUrl: 'https://the-internet.herokuapp.com',
  services: ['chromedriver'],
  framework: 'mocha',
  reporters: ['spec'],
  maxInstances: 5
}

exports.config = wdioTestRunner(
  {
    apiKey: API_KEY,
    serverURL: SERVER_URL
  },
  config
)
