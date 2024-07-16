import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  use: {
    launchOptions: {
      args: ['--headless=new']
    }
  }
})
