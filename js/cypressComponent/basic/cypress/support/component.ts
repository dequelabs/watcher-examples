// Cypress support file for component testing setup

import { mount } from '@cypress/react'
// Import custom Cypress commands
import './commands'
// Import axe-core watcher Cypress commands for accessibility testing
import '@axe-core/watcher/dist/cypressCommands'

// Extend Cypress types to include the custom mount command
// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}

// Add the custom mount command to Cypress
Cypress.Commands.add('mount', mount)

// Flush axe-watcher accessibility results after each test
afterEach(() => {
  cy.axeWatcherFlush()
})
