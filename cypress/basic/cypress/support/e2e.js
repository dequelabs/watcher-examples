// Import the axe-watcher commands.
require('@axe-core/watcher/cypressCommands')

// Flush axe-watcher results after each test.
afterEach(() => {
  cy.axeWatcherFlush()
})
