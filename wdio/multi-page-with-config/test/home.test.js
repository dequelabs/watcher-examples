describe('Home', () => {
  it('should list several links', async () => {
    await browser.url('https://the-internet.herokuapp.com')
    await browser.$('ul a[href="/broken_images"]').click()
    await browser.$('.example').waitForExist()
  })
})
