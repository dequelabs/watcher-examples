describe('My Login Application', () => {
  describe('Automatic Analysis', () => {
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

  describe('Manual Mode', () => {
    it('should login with valid credentials', () => {
      cy
        // Stop automatic axe analysis.
        .axeStop()
        .visit('https://the-internet.herokuapp.com/login')
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
})
