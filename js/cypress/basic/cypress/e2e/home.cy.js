describe('My Login Application', () => {
  cy.visit('https://the-internet.herokuapp.com')
    .get('ul li a[href="/login"]')
    .should('exist')
    .click()
    .wait(1000)
    .get('h2')
    .should('have.text', 'Login Page')
})
