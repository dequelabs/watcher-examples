export const BASE_URL = 'https://axe-devtools-web-demo.vercel.app'

export async function wait(ms: number) {
  await browser.pause(ms)
}

export async function scrollDown(amount = 600) {
  await browser.execute((y: number) => window.scrollBy(0, y), amount)
  await wait(300)
}

export async function scrollToBottom() {
  await browser.execute(() => window.scrollTo(0, document.body.scrollHeight))
  await wait(500)
}

export async function scrollToTop() {
  await browser.execute(() => window.scrollTo(0, 0))
  await wait(300)
}

export async function dismissCookieBanner() {
  try {
    const acceptBtn = await browser.$('a=Accept')
    if (await acceptBtn.isDisplayed()) {
      await acceptBtn.click()
      await wait(300)
    }
  } catch {
    // No cookie banner
  }
}
