import type { ElementHandle } from '@playwright/test'
import { test, expect } from './fixtures'

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login')
  })

  test('should contain a username input', async ({ page }) => {
    const input = await page.$('#username')
    expect(input).not.toBeNull()
  })

  test('should contain a password input', async ({ page }) => {
    const input = await page.$('#password')
    expect(input).not.toBeNull()
  })

  test('should contain a submit button', async ({ page }) => {
    const button = await page.$('button[type="submit"]')
    expect(button).not.toBeNull()
  })

  test.describe('entering credentials and submitting the form', () => {
    test('should login', async ({ page }) => {
      const username = (await page.$(
        '#username'
      )) as ElementHandle<HTMLInputElement>
      await username.fill('tomsmith')

      const password = (await page.$(
        '#password'
      )) as ElementHandle<HTMLInputElement>
      await password.fill('SuperSecretPassword!')

      const button = (await page.$(
        'button[type="submit"]'
      )) as ElementHandle<HTMLButtonElement>
      await button.click()

      await page.waitForSelector('#flash')
    })
  })
})
