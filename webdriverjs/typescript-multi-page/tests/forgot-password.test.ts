import 'mocha'
import { assert } from 'chai'
import { until } from 'selenium-webdriver'
import { browser } from './setup'

describe('Forgot password page', () => {
  beforeEach(async () => {
    await browser.get('https://the-internet.herokuapp.com/forgot_password')
  })

  it('should contain an email input', async () => {
    const input = await browser.findElement({ id: 'email' })
    assert.isNotNull(input)
  })

  it('should contain a submit button', async () => {
    const button = await browser.findElement({ css: 'button[type="submit"]' })
    assert.isNotNull(button)
  })

  describe('entering an email into the input and submitting the form', () => {
    it('should navigate', async () => {
      const email = await browser.findElement({ id: 'email' })
      const button = await browser.findElement({ css: 'button[type="submit"]' })

      await email.sendKeys('person@place.biz')
      await button.click()

      await browser.wait(until.titleIs(''))
    })
  })
})
