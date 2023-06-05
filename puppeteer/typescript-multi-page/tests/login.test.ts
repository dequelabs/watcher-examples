import 'mocha'
import { assert } from 'chai'
import { page } from './setup'

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
      await page.type('#username', 'tomsmith')
      await page.type('#password', 'SuperSecretPassword!')
      await page.click('button[type="submit"]')
      await page.waitForSelector('#flash')
    })
  })
})
