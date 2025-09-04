import { test, expect } from './fixtures'

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com')
  })

  test('should contain a list of links', async ({ page }) => {
    const links = await page.$$('ul li a')
    expect(links.length).toBeGreaterThan(20)
  })

  test('should contain a link to the login page', async ({ page }) => {
    const loginLink = await page.$('ul li a[href="/login"]')
    expect(loginLink).not.toBeNull()
  })
})
