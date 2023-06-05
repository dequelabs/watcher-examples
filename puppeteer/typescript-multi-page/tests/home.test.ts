import 'mocha'
import { assert } from 'chai'
import { page } from './setup'

describe('Home page', () => {
  beforeEach(async () => {
    await page.goto('https://the-internet.herokuapp.com')
  })


  it('should contain a list of links', async () => {
    const links = await page.$$('ul li a')
    assert.isAtLeast(links.length, 20)
  })

  it('should contain a link to the login page', async () => {
    const loginLink = await page.$('ul li a[href="/login"]')
    assert.isNotNull(loginLink)
  })
})
