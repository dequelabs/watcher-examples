const { defineConfig } = require('cypress')
const { cypressConfig } = require('@axe-core/watcher')

// Get your configuration from environment variables.
const { API_KEY, SERVER_URL = 'https://axe.deque.com' } = process.env

module.exports = defineConfig(
  cypressConfig({
    axe: {
      apiKey: API_KEY,
      serverURL: SERVER_URL
    },
    e2e: {
      setupNodeEvents(on, config) {
        on('before:browser:launch', (browser = {}, launchOptions) => {
          if (browser.name === 'chrome') {
            launchOptions.args.push('--disable-features=DisableLoadExtensionCommandLineSwitch');
          }
          return launchOptions;
        });
      },
    },
    defaultCommandTimeout: 10000
  })
)
