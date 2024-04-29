describe('My Login Application', () => {
  it('should login with valid credentials', () => {
    cy.visit('https://the-internet.herokuapp.com/login')
      .get('#username')
      .type(Cypress.env('USERNAME'))
      .get('#password')
      .type(Cypress.env('PASSWORD'))
      .get('button[type="submit"]')
      .click()
      .wait(1000)
      .get('#flash')
      .should('exist')
  })
})
