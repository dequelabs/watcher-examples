const { WdioController, wrapWdio } = require('@axe-core/watcher')

describe('Login', () => {
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
