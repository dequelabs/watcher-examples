import type { ElementHandle } from '@playwright/test'
import { test, expect } from './fixtures'

test.describe('Forgot password page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/forgot_password')
  })

  test('should contain an email input', async ({ page }) => {
    const input = await page.$('#email')
    expect(input).not.toBeNull()
  })

  test('should contain a submit button', async ({ page }) => {
    const button = await page.$('button[type="submit"]')
    expect(button).not.toBeNull()
  })

  test.describe('entering an email into the input and submitting the form', () => {
    test('should navigate', async ({ page }) => {
      const input = (await page.$('#email')) as ElementHandle<HTMLInputElement>
      await input.fill('person@place.biz')
      const button = (await page.$(
        'button[type="submit"]'
      )) as ElementHandle<HTMLButtonElement>
      await button.click()
      await page.waitForFunction(() =>
        document.body.innerHTML.includes('Internal Server Error')
      )
    })
  })
})
