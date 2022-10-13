// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import the axe-watcher commands.
import '@axe-core/watcher/dist/cypressCommands'

// Flush axe-watcher results after each test.
afterEach(() => {
  cy.axeFlush()
})
