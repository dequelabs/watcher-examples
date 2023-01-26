const { WdioController, wrapWdio } = require('@axe-core/watcher')

describe('Forgot Password', () => {
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
