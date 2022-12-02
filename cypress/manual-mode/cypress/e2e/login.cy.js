describe('My Login Application', () => {
  it('should login with valid credentials', () => {
    cy.visit('https://the-internet.herokuapp.com/login')
      // Analyze the page.
      .axeAnalyze()
      .get('#username')
      .type('tomsmith')
      .get('#password')
      .type('SuperSecretPassword!')
      .get('button[type="submit"]')
      .click()
      .wait(1000)
      // Analyze the page.
      .axeAnalyze()
      // Restart automatic axe analysis.
      .axeStart()
      .get('#flash')
      .should('exist')
  })
})
