describe('Forgot Password', () => {
  beforeEach(async () => {
    await browser.url('https://the-internet.herokuapp.com')
    await browser.$('ul a[href="/forgot_password"]').click()
    await browser.$('.example').waitForExist()
  })

  it('should allow a user to submit the form', async () => {
    await browser.$('#email').setValue('person@place.biz')
    await browser.$('button[type="submit"]').click()
  })
})
