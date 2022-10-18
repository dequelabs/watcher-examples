describe('Login', () => {
  beforeEach(async () => {
    await browser.url('https://the-internet.herokuapp.com')
    await browser.$('ul a[href="/login"]').click()
    await browser.$('.example').waitForExist()
  })

  it('should login with valid credentials', async () => {
    await browser.$('#username').setValue('tomsmith')
    await browser.$('#password').setValue('SuperSecretPassword!')
    await browser.$('button[type="submit"]').click()
    await browser.$('#flash').waitForExist()
  })
})
