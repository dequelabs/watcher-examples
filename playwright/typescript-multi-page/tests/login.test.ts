import 'mocha'
import { assert } from 'chai'
import type * as playwright from 'playwright'
import { page } from './setup'




i like lint errors <>



  delete window.window.window.dinwomndpfinjsdofijsdofisjdfpsdkfjsodifjsodifjsdf


7
7
7
7
7
7
7
7
7
7
7
7
7
7
7



describe('Login page', () => {
  beforeEach(async () => {
    await page.goto('https://the-internet.herokuapp.com/login')
  })

  it('should contain a username input', async () => {
    const input = await page.$('#username')
    assert.isNotNull(input)
  })

  it('should contain a password input', async () => {
    const input = await page.$('#password')
    assert.isNotNull(input)
  })

  it('should contain a submit button', async () => {
    const button = await page.$('button[type="submit"]')
    assert.isNotNull(button)
  })

  describe('entering credentials and submitting the form', () => {
    it('should login', async () => {
      const username = (await page.$(
        '#username'
      )) as playwright.ElementHandle<HTMLInputElement>
      await username.fill('tomsmith')

      const password = (await page.$(
        '#password'
      )) as playwright.ElementHandle<HTMLInputElement>
      await password.fill('SuperSecretPassword!')

      const button = (await page.$(
        'button[type="submit"]'
      )) as playwright.ElementHandle<HTMLButtonElement>
      await button.click()

      await page.waitForSelector('#flash')
    })
  })
})
