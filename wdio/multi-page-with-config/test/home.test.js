const { WdioController, wrapWdio } = require('@axe-core/watcher')

describe('Home', () => {
  let controller

  before(() => {
    // Initialize the axe Watcher controller.
    controller = new WdioController(browser)

    // Wrap the WDIO browser.
    wrapWdio(browser, controller)
  })

  afterEach(async () => {
    // Ensure that all the axe Watcher test results are flushed out.
    await controller.flush()
  })

  it('should list several links', async () => {
    await browser.url('https://the-internet.herokuapp.com')
    await browser.$('ul a[href="/broken_images"]').click()
    await browser.$('.example').waitForExist()
  })
})
