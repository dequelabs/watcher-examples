const { wdioTestRunner, WdioController } = require('@axe-core/watcher')

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
    apiKey: '11dc1214-cd42-4882-b568-bfc7dc384c18', // 'YOUR_API_KEY'
    serverURL: 'http://localhost:3000' // 'YOUR_SERVER_URL'
  },
  config
)
