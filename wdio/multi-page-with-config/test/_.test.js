const { WdioController } = require('@axe-core/watcher')

// Tap into Mocha's global hooks, ensuring axe Watcher flushes after each test is run.
afterEach(async () => {
  await new WdioController(browser).flush()
})
