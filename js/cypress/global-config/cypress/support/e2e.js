// Import the axe-watcher commands.
require('@axe-core/watcher/cypress/support')

// Flush axe-watcher results after each test.
afterEach(() => {
  cy.axeWatcherFlush()
})
