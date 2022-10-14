describe('Forgot Password', () => {
  it('should allow a user to submit the form',  () => {
    cy.visit('https://the-internet.herokuapp.com/forgot_password')
      .get('#email')
      .type('person@place.biz')
      .get('button[type="submit"]')
      .click()
  })
})
