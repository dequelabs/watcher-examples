describe('My Homepage', () => {
  it('should load and navigate to login page', () => {
    cy.visit('https://the-internet.herokuapp.com')
      .get('ul li a[href="/login"]')
      .should('exist')
      .click()
      .get('h2')
      .should('have.text', 'Login Page')
  })
})
