const { WdioController } = require('@axe-core/watcher')

describe('Home', () => {
  afterEach(async () => {
    await new WdioController(browser).flush()
  })

  it('should list several links', async () => {
    await browser.url('https://the-internet.herokuapp.com')
    await browser.$('ul a[href="/broken_images"]').click()
    await browser.$('.example').waitForExist()
  })
})
