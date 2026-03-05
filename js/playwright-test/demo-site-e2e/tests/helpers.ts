import type { Page } from '@playwright/test'

export const BASE_URL = 'https://axe-devtools-web-demo.vercel.app'

export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function scrollDown(page: Page, amount = 600) {
  await page.evaluate((y) => window.scrollBy(0, y), amount)
  await wait(300)
}

export async function scrollToBottom(page: Page) {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await wait(500)
}

export async function scrollToTop(page: Page) {
  await page.evaluate(() => window.scrollTo(0, 0))
  await wait(300)
}

export async function dismissCookieBanner(page: Page) {
  const acceptBtn = page.locator('a:has-text("Accept"), button:has-text("Accept")').first()
  if (await acceptBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await acceptBtn.click()
    await wait(300)
  }
}
