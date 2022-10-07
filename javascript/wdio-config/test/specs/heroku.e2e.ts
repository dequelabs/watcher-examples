import { WdioController } from '@axe-core/watcher'
import LoginPage from '../pageobjects/login.heroku.page'
import SecurePage from '../pageobjects/secure.heroku.page'

describe('My Login application', () => {
  afterEach(async () => {
    // initialize the axe Watcher controller
    const controller = new WdioController(browser)
    await controller.flush()
  })

  it('should login with valid credentials', async () => {
    await LoginPage.open()

    await LoginPage.login('tomsmith', 'SuperSecretPassword!')
    await expect(SecurePage.flashAlert).toBeExisting()
    await expect(SecurePage.flashAlert).toHaveTextContaining(
      'You logged into a secure area!'
    )
  })
})
