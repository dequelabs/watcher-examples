import 'mocha'
import { assert } from 'chai'
import { By } from 'selenium-webdriver'
import { browser } from './setup'

describe('Home page', () => {
  beforeEach(async () => {
    await browser.get('https://the-internet.herokuapp.com')
  })

  it('should contain a list of links', async () => {
    const links = await browser.findElements(By.css('ul li a'))
    assert.isAtLeast(links.length, 20)
  })

  it('should contain a link to the login page', async () => {
    const loginLink = await browser.findElement(
      By.css('ul li a[href="/login"]')
    )
    assert.exists(loginLink)
  })
})
