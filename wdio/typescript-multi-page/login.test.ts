import 'mocha'
import { assert } from 'chai'
import { browser } from './setup'

describe('login', () => {
  it('should contain a username input', async () => {
    await browser.url('https://the-internet.herokuapp.com/login')

    const title = await browser.getTitle()
    assert.equal(title, 'The Internet')

    const username = browser.$('#username')
    assert.exists(username)
  })

  it('should contain a password input', async () => {
    await browser.url('https://the-internet.herokuapp.com/login')

    const title = await browser.getTitle()
    assert.equal(title, 'The Internet')

    const password = browser.$('#password')
    assert.exists(password)
  })

  it('should contain a submit button', async () => {
    await browser.url('https://the-internet.herokuapp.com/login')

    const title = await browser.getTitle()
    assert.equal(title, 'The Internet')

    const submit = browser.$('button[type="submit"]')
    assert.exists(submit)
  })

  describe('entering credentials and submitting the form', () => {
    it('should log in', async () => {
      await browser.url('https://the-internet.herokuapp.com/login')

      const title = await browser.getTitle()
      assert.equal(title, 'The Internet')

      const username = browser.$('#username')
      assert.exists(username)

      const password = browser.$('#password')
      assert.exists(password)

      const submit = browser.$('button[type="submit"]')
      assert.exists(submit)

      await username.setValue('tomsmith')
      await password.setValue('SuperSecretPassword!')

      await submit.click()
    })
  })
})
