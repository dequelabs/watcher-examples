describe('app with iframes', () => {
  it('should do stuff', () => {
    cy.visit('http://localhost:6070').get('button').click().wait(100)
  })
})
