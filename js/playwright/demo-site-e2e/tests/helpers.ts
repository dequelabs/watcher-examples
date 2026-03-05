import { page } from './setup'

export const BASE_URL = 'https://axe-devtools-web-demo.vercel.app'

/**
 * Utility: small delay to let DOM mutations settle after interactions.
 */
export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Utility: scroll the page by a given amount.
 */
export async function scrollDown(amount = 600) {
  await page.evaluate((y) => window.scrollBy(0, y), amount)
  await wait(300)
}

/**
 * Utility: scroll to the very bottom of the page.
 */
export async function scrollToBottom() {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await wait(500)
}

/**
 * Utility: scroll back to the top of the page.
 */
export async function scrollToTop() {
  await page.evaluate(() => window.scrollTo(0, 0))
  await wait(300)
}

/**
 * Utility: dismiss the cookie banner if present.
 */
export async function dismissCookieBanner() {
  const acceptBtn = await page.$('a:has-text("Accept"), button:has-text("Accept")')
  if (acceptBtn) {
    await acceptBtn.click()
    await wait(300)
  }
}
