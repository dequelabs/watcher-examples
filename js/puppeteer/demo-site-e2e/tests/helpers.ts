import { page } from './setup'

export const BASE_URL = 'https://axe-devtools-web-demo.vercel.app'

export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function scrollDown(amount = 600) {
  await page.evaluate((y) => window.scrollBy(0, y), amount)
  await wait(300)
}

export async function scrollToBottom() {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await wait(500)
}

export async function scrollToTop() {
  await page.evaluate(() => window.scrollTo(0, 0))
  await wait(300)
}

export async function dismissCookieBanner() {
  const acceptBtn = await page.$('a:has-text("Accept"), button:has-text("Accept")')
  if (acceptBtn) {
    await acceptBtn.click()
    await wait(300)
  }
}
