// Import the axe-watcher commands.
require('@axe-core/watcher/dist/cypressCommands')

// Wrap the Cypress driver.
beforeEach(() => {
  const { wrapCy } = require('@axe-core/watcher/dist/cypress')
  wrapCy(cy)
})

// Flush axe-watcher results after each test.
afterEach(() => {
  cy.axeFlush()
})
