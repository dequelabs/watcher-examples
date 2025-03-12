describe('My Login Application', () => {
  it('should login with valid credentials', () => {
    cy.visit('https://the-internet.herokuapp.com/login')
      .get('#username')
      .type('tomsmith')
      .get('#password')
      .type('SuperSecretPassword!')
      .get('button[type="submit"]')
      .click()
      .wait(1000)
      .get('#flash')
      .should('exist')
  })
})
