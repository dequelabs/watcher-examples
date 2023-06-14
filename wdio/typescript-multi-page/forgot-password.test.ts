import 'mocha'
import { assert } from 'chai'
import { browser } from './setup'

describe('forgot password', () => {
  it('should contain an email input', async () => {
    await browser.url('https://the-internet.herokuapp.com/forgot_password')

    const title = await browser.getTitle()
    assert.equal(title, 'The Internet')

    const email = browser.$('#email')
    assert.exists(email)
  })

  it('should contain a submit button', async () => {
    await browser.url('https://the-internet.herokuapp.com/forgot_password')

    const title = await browser.getTitle()
    assert.equal(title, 'The Internet')

    const submit = browser.$('button[type="submit"]')
    assert.exists(submit)
  })

  describe('entering an email into the input and submitting the form', () => {
    it('should navigate', async () => {
      await browser.url('https://the-internet.herokuapp.com/forgot_password')

      const title = await browser.getTitle()
      assert.equal(title, 'The Internet')

      const email = browser.$('#email')
      assert.exists(email)

      const submit = browser.$('button[type="submit"]')
      assert.exists(submit)

      await email.setValue('person@place.biz')
      await submit.click()
    })
  })
})
