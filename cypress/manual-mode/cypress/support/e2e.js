// Import the axe-watcher commands.
require('@axe-core/watcher/dist/cypressCommands')

// Flush axe-watcher results after each test.
afterEach(() => {
  cy.axeFlush()
})
