describe('My Login Application', () => {
  it('should login with valid credentials', () => {
    const loginCredentials = Cypress.env('login')

    cy.visit('https://the-internet.herokuapp.com/login')
      .get('#username')
      .type(loginCredentials.username)
      .get('#password')
      .type(Cypress.env('password'))
      .get('button[type="submit"]')
      .click()
      .wait(1000)
      .get('#flash')
      .should('exist')
  })
})
