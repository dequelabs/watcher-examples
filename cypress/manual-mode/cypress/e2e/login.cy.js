describe('My Login Application', () => {
  it('should login with valid credentials', () => {
    cy.visit('https://the-internet.herokuapp.com/login')
      // Analyze the page.
      .axeWatcherAnalyze()
      .get('#username')
      .type('tomsmith')
      .get('#password')
      .type('SuperSecretPassword!')
      .get('button[type="submit"]')
      .click()
      .wait(1000)
      // Analyze the page.
      .axeWatcherAnalyze()
      // Restart automatic axe analysis.
      .axeWatcherStart()
      .get('#flash')
      .should('exist')
  })
})
