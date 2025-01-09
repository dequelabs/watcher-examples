/*
  Lets see the number of page state calculation
  As the auto-analyze is false, it will not analyze automatically

  We first navigate to the page.
  Then we analyze the page. (+1)
  Then we fill the form.
  Then Turn on auto-analyze.
  Then we click the submit button (+1)
  Then we wait for the element to appear.
  Then we analyze the page. (+1)
  So, the total number of page state calculation should be 3.
*/
describe('My Login Application', () => {
  it('should login with valid credentials', () => {
    cy.visit('https://the-internet.herokuapp.com/login')
      // Analyze after navigating to the page.
      .axeWatcherAnalyze()
      .get('#username')
      .type('tomsmith')
      .get('#password')
      .type('SuperSecretPassword!')
      // Start automatic axe analysis.
      .axeWatcherStart()
      .get('button[type="submit"]')
      .click()
      .get('#flash')
      .should('exist')
      // Stop automatic axe analysis.
      .axeWatcherStop()
      // Analyze after logging in.
      .axeWatcherAnalyze()
  })
})
