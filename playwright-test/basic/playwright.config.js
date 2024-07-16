const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './tests',
  use: {
    launchOptions: {
      args: ['--headless=new']
    }
  }
})
