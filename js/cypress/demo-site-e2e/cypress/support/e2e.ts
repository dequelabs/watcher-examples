import '@axe-core/watcher/cypress/support'

// Ignore React hydration errors from the Next.js demo site
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('Minified React error')) {
    return false
  }
})

afterEach(() => {
  cy.axeWatcherFlush()
})

Cypress.Commands.add('dismissCookieBanner', () => {
  cy.get('body').then($body => {
    const acceptBtn = $body.find('a:contains("Accept"), button:contains("Accept")')
    if (acceptBtn.length) {
      cy.wrap(acceptBtn.first()).click()
      cy.wait(300)
    }
  })
})

Cypress.Commands.add('scrollDownBy', (amount: number = 600) => {
  cy.window().then(win => win.scrollBy(0, amount))
  cy.wait(300)
})

Cypress.Commands.add('scrollToBottom', () => {
  cy.window().then(win => win.scrollTo(0, document.body.scrollHeight))
  cy.wait(500)
})

declare global {
  namespace Cypress {
    interface Chainable {
      dismissCookieBanner(): Chainable<void>
      scrollDownBy(amount?: number): Chainable<void>
      scrollToBottom(): Chainable<void>
    }
  }
}
