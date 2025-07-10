describe('My Login Application', () => {
  it('should login with valid credentials', () => {
    cy.visit('https://google.com')
    cy.axeWatcherAnalyze()
  })
})
