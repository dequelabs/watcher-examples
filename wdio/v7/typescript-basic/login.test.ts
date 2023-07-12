import 'mocha'
import { assert } from 'chai'
import { browser } from './setup'

describe('home', () => {
  it('should contain a list of links', async () => {
    await browser.url('https://the-internet.herokuapp.com')

    const title = await browser.getTitle()
    assert.equal(title, 'The Internet')

    const links = await browser.$$('ul li a')
    assert.isAbove(links.length, 20)
  })

  it('should contain a link to the login page', async () => {
    await browser.url('https://the-internet.herokuapp.com')

    const title = await browser.getTitle()
    assert.equal(title, 'The Internet')

    const login = await browser.$('ul li a[href="/login"]')
    assert.exists(login)
  })
})
