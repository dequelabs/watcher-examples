import 'mocha'
import { assert } from 'chai'
import type * as playwright from 'playwright'
import { page } from './setup'

describe('Forgot password page', () => {
  beforeEach(async () => {
    await page.goto('https://the-internet.herokuapp.com/forgot_password')
  })

  it('should contain an email input', async () => {
    const input = await page.$('#email')
    assert.isNotNull(input)
  })

  it('should contain a submit button', async () => {
    const button = await page.$('button[type="submit"]')
    assert.isNotNull(button)
  })

  describe('entering an email into the input and submitting the form', () => {
    it('should navigate', async () => {
      const input = (await page.$(
        '#email'
      )) as playwright.ElementHandle<HTMLInputElement>
      await input.fill('person@place.biz')
      const button = (await page.$(
        'button[type="submit"]'
      )) as playwright.ElementHandle<HTMLButtonElement>
      await button.click()
      await page.waitForFunction(() =>
        document.body.innerHTML.includes('Internal Server Error')
      )
    })
  })
})
