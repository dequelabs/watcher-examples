import { browser } from './setup'
import { By } from 'selenium-webdriver'

export const BASE_URL = 'https://axe-devtools-web-demo.vercel.app'

export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function scrollDown(amount = 600) {
  await browser.executeScript(`window.scrollBy(0, ${amount})`)
  await wait(300)
}

export async function scrollToBottom() {
  await browser.executeScript('window.scrollTo(0, document.body.scrollHeight)')
  await wait(500)
}

export async function scrollToTop() {
  await browser.executeScript('window.scrollTo(0, 0)')
  await wait(300)
}

export async function dismissCookieBanner() {
  try {
    const acceptBtns = await browser.findElements(By.xpath("//a[contains(text(),'Accept')] | //button[contains(text(),'Accept')]"))
    if (acceptBtns.length > 0) {
      await acceptBtns[0].click()
      await wait(300)
    }
  } catch {
    // No cookie banner
  }
}
